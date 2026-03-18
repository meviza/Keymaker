# KEYMAKER Frontend

## Development

Preferred local development command:

```bash
npm run dev:webpack
```

Reason:
- `next dev --webpack` is currently the stable local path for this project.
- plain `npm run dev` uses Turbopack and may fail locally because `.next/dev` cache writes can panic during CSS build output.

Default ports:
- webpack dev: `http://localhost:3001` if `3000` is already busy
- production preview: `http://localhost:3002` when started with `npm run start -- --port 3002`

## Validation

Useful commands:

```bash
npm run lint
npm run build
npm run start -- --port 3002
```

Routes that were explicitly smoke-tested after the runtime fix:
- `/reports`
- `/observatory`
- `/command`
- `/agents`
- `/arti`

## Notes

- Production build is healthy with `npm run build`.
- If local dev becomes unstable, clear `.next` and restart with `npm run dev:webpack`.
