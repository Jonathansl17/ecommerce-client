import { CATALOG_STRINGS } from '../constants/catalog.constants';

export function EmptyCatalog() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
      {CATALOG_STRINGS.empty}
    </div>
  );
}
