import GRANULARLAYERS_SERVICE from "@/services/promedina/granular-layers/granular-layers.service";
import useGranularLayersStore, { GranularLayersData } from "@/stores/promedina/granular-layers/granular-layers.store";

export function replaceNullValues(data: GranularLayersData, type: string) {
  let formatedData = data;
    for (const key in formatedData) {
      if (formatedData[key] === null) {
        formatedData[key] = '---';
      }
    }

    this.store_actions.setData({ step: 0, key: type, value: data });
}