/// <reference types="astro/client" />

declare global {
  namespace App {
    interface Locals {
      user: any;
      session: any;
    }
  }
}

export {};
