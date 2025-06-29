import {coreApiFetch} from "@/helpers/httpClient";

export const fetchBranches = async () => {
  return await coreApiFetch('po_branches/ajax_all_branch_info', { method: "GET" });
};
