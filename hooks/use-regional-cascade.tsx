"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getRegionalData } from "@/lib/api/shipping-region"
import { endpoints } from "@/lib/api/endpoints"

type RegionItem = { code: string; name: string }

type RegionCascadeInitial = {
  province?: string
  regency?: string
  district?: string
  villageName?: string
  villageCode?: string
}

function toArray(data: unknown): RegionItem[] {
  if (Array.isArray(data)) return data
  return []
}

function findByCode(items: RegionItem[], code: string) {
  return items.find((i) => i.code === code)
}

function findCodeByName(items: RegionItem[], name: string) {
  return items.find((i) => i.name === name)?.code ?? ""
}

export function useRegionalCascade(initial?: RegionCascadeInitial) {
  const [province, setProvince] = useState("")
  const [regency, setRegency] = useState("")
  const [district, setDistrict] = useState("")
  const [village, setVillage] = useState("")

  const [provinces, setProvinces] = useState<RegionItem[]>([])
  const [regencies, setRegencies] = useState<RegionItem[]>([])
  const [districts, setDistricts] = useState<RegionItem[]>([])
  const [villages, setVillages] = useState<RegionItem[]>([])

  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingRegencies, setLoadingRegencies] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingVillages, setLoadingVillages] = useState(false)

  const initialRef = useRef(initial)

  useEffect(() => {
    let cancelled = false
    getRegionalData<{ data: RegionItem[] }>(endpoints.regional.provinces)
      .then((res) => {
        if (cancelled) return
        const list = toArray(res.data?.data)
        setProvinces(list)

        const init = initialRef.current
        if (init?.province) {
          const code = findCodeByName(list, init.province)
          if (code) {
            setProvince(code)
            setLoadingRegencies(true)
            getRegionalData<{ data: RegionItem[] }>(
              endpoints.regional.provinceRegencies(code),
            ).then((res2) => {
              if (cancelled) return
              const regencyList = toArray(res2.data?.data)
              setRegencies(regencyList)

              if (init.regency) {
                const rCode = findCodeByName(regencyList, init.regency)
                if (rCode) {
                  setRegency(rCode)
                  setLoadingDistricts(true)
                  getRegionalData<{ data: RegionItem[] }>(
                    endpoints.regional.regencyDistricts(rCode),
                  ).then((res3) => {
                    if (cancelled) return
                    const districtList = toArray(res3.data?.data)
                    setDistricts(districtList)

                    if (init.district) {
                      const dCode = findCodeByName(districtList, init.district)
                      if (dCode) {
                        setDistrict(dCode)
                        setLoadingVillages(true)
                        getRegionalData<{ data: RegionItem[] }>(
                          endpoints.regional.districtVillages(dCode),
                        ).then((res4) => {
                          if (cancelled) return
                          const villageList = toArray(res4.data?.data)
                          setVillages(villageList)

                          if (init.villageCode) {
                            setVillage(init.villageCode)
                          } else if (init.villageName) {
                            const vCode = findCodeByName(villageList, init.villageName)
                            if (vCode) setVillage(vCode)
                          }
                        }).finally(() => {
                          if (!cancelled) setLoadingVillages(false)
                        })
                      }
                    }
                  }).finally(() => {
                    if (!cancelled) setLoadingDistricts(false)
                  })
                }
              }
            }).finally(() => {
              if (!cancelled) setLoadingRegencies(false)
            })
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingProvinces(false)
      })
    return () => { cancelled = true }
  }, [])

  const fetchRegencies = useCallback(async (provinceCode: string) => {
    if (!provinceCode) { setRegencies([]); return }
    setLoadingRegencies(true)
    try {
      const res = await getRegionalData<{ data: RegionItem[] }>(
        endpoints.regional.provinceRegencies(provinceCode),
      )
      setRegencies(toArray(res.data?.data))
    } finally {
      setLoadingRegencies(false)
    }
  }, [])

  const fetchDistricts = useCallback(async (regencyCode: string) => {
    if (!regencyCode) { setDistricts([]); return }
    setLoadingDistricts(true)
    try {
      const res = await getRegionalData<{ data: RegionItem[] }>(
        endpoints.regional.regencyDistricts(regencyCode),
      )
      setDistricts(toArray(res.data?.data))
    } finally {
      setLoadingDistricts(false)
    }
  }, [])

  const fetchVillages = useCallback(async (districtCode: string) => {
    if (!districtCode) { setVillages([]); return }
    setLoadingVillages(true)
    try {
      const res = await getRegionalData<{ data: RegionItem[] }>(
        endpoints.regional.districtVillages(districtCode),
      )
      setVillages(toArray(res.data?.data))
    } finally {
      setLoadingVillages(false)
    }
  }, [])

  const onProvinceChange = useCallback(
    (code: string) => {
      setProvince(code)
      setRegency("")
      setDistrict("")
      setVillage("")
      setRegencies([])
      setDistricts([])
      setVillages([])
      if (code) fetchRegencies(code)
    },
    [fetchRegencies],
  )

  const onRegencyChange = useCallback(
    (code: string) => {
      setRegency(code)
      setDistrict("")
      setVillage("")
      setDistricts([])
      setVillages([])
      if (code) fetchDistricts(code)
    },
    [fetchDistricts],
  )

  const onDistrictChange = useCallback(
    (code: string) => {
      setDistrict(code)
      setVillage("")
      setVillages([])
      if (code) fetchVillages(code)
    },
    [fetchVillages],
  )

  const onVillageChange = useCallback((code: string) => {
    setVillage(code)
  }, [])

  const findName = (items: RegionItem[], code: string) =>
    findByCode(items, code)?.name ?? ""

  return {
    province,
    regency,
    district,
    village,
    provinces,
    regencies,
    districts,
    villages,
    loadingProvinces,
    loadingRegencies,
    loadingDistricts,
    loadingVillages,
    onProvinceChange,
    onRegencyChange,
    onDistrictChange,
    onVillageChange,
    provinceName: findName(provinces, province),
    regencyName: findName(regencies, regency),
    districtName: findName(districts, district),
    villageName: findName(villages, village),
    fetchRegencies,
    fetchDistricts,
    fetchVillages,
  }
}
