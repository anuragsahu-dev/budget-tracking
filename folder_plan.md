src/
 ├── app.ts
 ├── server.ts
 │
 ├── config/
 │     ├── env.ts
 │     ├── database.ts
 │     ├── cache.ts
 │     └── logger.ts
 │
 ├── modules/
 │     ├── shared/                       ← Common/Shared module
 │     │     ├── dto/
 │     │     │     ├── pagination.dto.ts
 │     │     │     └── response.dto.ts
 │     │     ├── interfaces/
 │     │     └── constants/
 │     │
 │     ├── auth/
 │     │     ├── dto/
 │     │     │     ├── login.dto.ts
 │     │     │     └── register.dto.ts
 │     │     ├── auth.controller.ts
 │     │     ├── auth.service.ts
 │     │     ├── auth.repository.ts      ← Optional
 │     │     ├── auth.routes.ts
 │     │     ├── auth.validation.ts
 │     │     ├── auth.types.ts
 │     │     └── index.ts                ← Barrel export
 │     │
 │     ├── transaction/
 │     │     ├── dto/
 │     │     ├── events/                 ← Domain events (optional)
 │     │     ├── transaction.controller.ts
 │     │     ├── transaction.service.ts
 │     │     ├── transaction.repository.ts
 │     │     ├── transaction.routes.ts
 │     │     ├── transaction.validation.ts
 │     │     └── index.ts
 │     │
 │     └── [other modules...]
 │
 ├── infrastructure/                     ← NEW (instead of workers/)
 │     ├── queue/
 │     │     ├── email.queue.ts
 │     │     └── budget-alert.queue.ts
 │     ├── cache/
 │     │     └── redis.service.ts
 │     └── storage/
 │           └── file.service.ts
 │
 ├── common/                             ← Framework-level utilities
 │     ├── middleware/
 │     │     ├── auth.middleware.ts
 │     │     ├── error.middleware.ts
 │     │     └── validate.middleware.ts
 │     ├── decorators/                   ← Optional
 │     ├── filters/                      ← Error filters
 │     └── guards/                       ← Auth guards
 │
 ├── core/                               ← Core business abstractions
 │     ├── base/
 │     │     ├── base.controller.ts
 │     │     ├── base.service.ts
 │     │     └── base.repository.ts
 │     └── interfaces/
 │           └── repository.interface.ts
 │
 ├── types/
 │     ├── express.d.ts
 │     └── global.d.ts
 │
 ├── docs/
 │     └── swagger.ts
 │
 └── tests/
       ├── e2e/                          ← End-to-end tests
       ├── integration/
       └── unit/