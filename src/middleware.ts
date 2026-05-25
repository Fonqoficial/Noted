import { defineMiddleware } from 'astro:middleware';
import { supabase } from '@/lib/supabase';

export const onRequest = defineMiddleware(async ({ url, redirect, locals, cookies }, next) => {
  
  // 1. Rutas públicas que no requieren autenticación
  const publicPaths = ['/', '/partituras', '/compositores', '/buscar', '/login', '/register'];
  const isPublicPath = publicPaths.some(path => 
    url.pathname === path || url.pathname.startsWith(path + '/')
  );

  const isAdminPath = url.pathname.startsWith('/admin');
  const isAccountPath = url.pathname.startsWith('/account');

  if (isPublicPath && !isAdminPath && !isAccountPath) {
    return next();
  }

  // 2. Verificar sesión
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/login?redirect=' + encodeURIComponent(url.pathname));
  }

  // 3. Si es ruta de admin, verificar rol en la base de datos
  if (isAdminPath) {
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    // ✅ SOLUCIÓN AL ERROR 'NEVER': Usamos (roleData as any)
    // Esto le dice a TS: "No te preocupes por el tipo, yo sé que role existe"
    if (roleError || !roleData || (roleData as any).role !== 'admin') {
      return redirect('/?error=unauthorized');
    }
  }

  // 4. Pasar la información al contexto de Astro (locals)
  // Ahora esto NO dará error porque ya configuramos src/env.d.ts
  locals.user = session.user;
  locals.session = session;

  return next();
});
