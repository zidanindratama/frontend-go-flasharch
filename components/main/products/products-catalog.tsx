"use client"

import { useCallback, useMemo } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { motion } from "framer-motion"
import { SearchInput } from "@/components/main/products/search-input"
import { SortSelect, parseSortOption, buildSortOption } from "@/components/main/products/sort-select"
import { FilterSidebar, PRICE_MIN, PRICE_MAX } from "@/components/main/products/filter-sidebar"
import { FilterDrawer } from "@/components/main/products/filter-drawer"
import { FilterChipBar } from "@/components/main/products/filter-chip-bar"
import { ProductGrid } from "@/components/main/products/product-grid"
import { PaginationBar } from "@/components/main/products/pagination-bar"
import { listProducts, listCategories, type ProductListParams } from "@/lib/api/catalog"


const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]
const DEFAULT_PER_PAGE = 12

function positiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function ProductsCatalog() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = positiveInt(searchParams.get("page"), 1)
  const perPage = positiveInt(searchParams.get("per_page"), DEFAULT_PER_PAGE)
  const search = searchParams.get("search") ?? ""
  const category = searchParams.get("category") ?? ""
  const minPrice = positiveInt(searchParams.get("min_price"), PRICE_MIN)
  const maxPrice = positiveInt(searchParams.get("max_price"), PRICE_MAX)
  const sort = searchParams.get("sort") ?? "newest"
  const order: "asc" | "desc" = searchParams.get("order") === "asc" ? "asc" : "desc"

  const sortOption = useMemo(() => buildSortOption(sort, order), [sort, order])

  const setQuery = useCallback(
    (next: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(next).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key)
          return
        }

        const numericValue = typeof value === "number" ? value : Number(value)

        if (key === "page" && numericValue === 1) {
          params.delete(key)
        } else if (key === "per_page" && numericValue === DEFAULT_PER_PAGE) {
          params.delete(key)
        } else if (key === "min_price" && numericValue === PRICE_MIN) {
          params.delete(key)
        } else if (key === "max_price" && numericValue === PRICE_MAX) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const buildParams = useMemo<ProductListParams>(() => {
    const params: ProductListParams = {
      page,
      per_page: perPage,
      search: search || undefined,
      sort,
      order,
    }
    if (category) params.category = category
    if (minPrice > PRICE_MIN) params.min_price = minPrice
    if (maxPrice < PRICE_MAX) params.max_price = maxPrice
    return params
  }, [page, perPage, search, sort, order, category, minPrice, maxPrice])

  const productsQuery = useQuery({
    queryKey: ["public-products", buildParams],
    queryFn: async () => {
      const response = await listProducts(buildParams)
      return response.data
    },
    placeholderData: (previousData) => previousData,
  })

  const categoriesQuery = useQuery({
    queryKey: ["public-categories"],
    queryFn: async () => {
      const response = await listCategories({ per_page: 100, status: "active" })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const products = productsQuery.data?.data.items ?? []
  const total = productsQuery.data?.data.total ?? 0
  const categories = categoriesQuery.data?.data.items ?? []

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (search) count += 1
    if (category) count += 1
    if (minPrice > PRICE_MIN || maxPrice < PRICE_MAX) count += 1
    return count
  }, [search, category, minPrice, maxPrice])

  const handleSearchChange = useCallback(
    (value: string) => {
      setQuery({ search: value, page: 1 })
    },
    [setQuery],
  )

  const handleSortChange = useCallback(
    (value: string) => {
      const { sort: nextSort, order: nextOrder } = parseSortOption(value)
      setQuery({ sort: nextSort, order: nextOrder, page: 1 })
    },
    [setQuery],
  )

  const handleCategoryChange = useCallback(
    (slug: string | null) => {
      setQuery({ category: slug ?? undefined, page: 1 })
    },
    [setQuery],
  )

  const handlePriceRangeChange = useCallback(
    (range: [number, number]) => {
      const [min, max] = range
      setQuery({
        min_price: min > PRICE_MIN ? min : undefined,
        max_price: max < PRICE_MAX ? max : undefined,
        page: 1,
      })
    },
    [setQuery],
  )

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setQuery({ page: nextPage })
    },
    [setQuery],
  )

  const handleClearFilters = useCallback(() => {
    setQuery({
      search: undefined,
      category: undefined,
      min_price: undefined,
      max_price: undefined,
      page: 1,
    })
  }, [setQuery])

  const hasFilters = activeFilterCount > 0

  return (
    <section className="w-full py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 lg:shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                categories={categories}
                selectedCategory={category || null}
                priceRange={[minPrice, maxPrice]}
                onCategoryChange={handleCategoryChange}
                onPriceRangeChange={handlePriceRangeChange}
                onClearFilters={handleClearFilters}
                activeFilterCount={activeFilterCount}
                isLoading={categoriesQuery.isLoading}
              />
            </div>
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: smoothEase, delay: 0.05 }}
              className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2">
                <FilterDrawer
                  categories={categories}
                  selectedCategory={category || null}
                  priceRange={[minPrice, maxPrice]}
                  onCategoryChange={handleCategoryChange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onClearFilters={handleClearFilters}
                  activeFilterCount={activeFilterCount}
                  isLoading={categoriesQuery.isLoading}
                />
                <span className="text-sm text-muted-foreground lg:hidden">
                  {activeFilterCount > 0 ? `${activeFilterCount} active` : "Filters"}
                </span>
              </div>

              <div className="flex flex-1 items-center gap-3 sm:justify-end">
                <SearchInput
                  key={search}
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                  className="w-full sm:max-w-sm"
                />
                <SortSelect
                  value={sortOption}
                  onChange={handleSortChange}
                  className="w-[180px] shrink-0"
                />
              </div>
            </motion.div>

            {/* Active filter chips */}
            <FilterChipBar
              search={search}
              selectedCategory={category || null}
              priceRange={[minPrice, maxPrice]}
              minPrice={PRICE_MIN}
              maxPrice={PRICE_MAX}
              categories={categories}
              onClearSearch={() => handleSearchChange("")}
              onClearCategory={() => handleCategoryChange(null)}
              onClearPriceRange={() => handlePriceRangeChange([PRICE_MIN, PRICE_MAX])}
              onClearAll={handleClearFilters}
              className="mb-5"
            />

            {/* Results count */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {productsQuery.isLoading ? (
                  "Loading products..."
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-foreground tabular-nums">
                      {total.toLocaleString("id-ID")}
                    </span>{" "}
                    product{total === 1 ? "" : "s"}
                  </>
                )}
              </p>
            </div>

            {/* Product grid */}
            <ProductGrid
              products={products}
              isLoading={productsQuery.isLoading}
              hasFilters={hasFilters}
              perPage={perPage}
            />

            {/* Pagination */}
            {total > 0 && (
              <PaginationBar
                page={page}
                perPage={perPage}
                total={total}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
