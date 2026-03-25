/// <reference types="vite/client" />

export {}

// Module augmentation to re-export ExecutionMethod from appwrite v23+
// (the enum is defined internally but omitted from the main types/index.d.ts entry point)
declare module 'appwrite' {
  enum ExecutionMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS',
    HEAD = 'HEAD',
  }
  export { ExecutionMethod }
}
