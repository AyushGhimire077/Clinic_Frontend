/* ---------------- Helpers ---------------- */
export async function commandWrapper<S>(
  set: (state: Partial<S>) => void,
  get: () => S,
  fn: () => Promise<any>,
  postFetch?: () => Promise<any> // optional post-action like fetchAll
) {
  set({ isLoading: true } as unknown as Partial<S>);
  try {
    await fn();
    if (postFetch) await postFetch();
  } finally {
    set({ isLoading: false } as unknown as Partial<S>);
  }
}

export async function queryWrapper<S>(
  set: (state: Partial<S>) => void,
  get: () => S,
  fn: () => Promise<any>,
  postCount?: () => Promise<any> // optional post-action like countAll
) {
  set({ isLoading: true } as unknown as Partial<S>);
  try {
    await fn();
    if (postCount) await postCount();
  } finally {
    set({ isLoading: false } as unknown as Partial<S>);
  }
}

export function getPagination<
  S extends { pagination: { currentPage: number; pageSize: number } }
>(get: () => S): { page: number; size: number } {
  const { pagination } = get();
  return { page: pagination.currentPage, size: pagination.pageSize };
}
