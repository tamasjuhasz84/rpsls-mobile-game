import { vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

vi.mock("@/utils/moveAssets", () => ({
  getMoveAsset: vi.fn(() => ""),
  MOVE_ICON_ASSETS: {
    rock: "",
    paper: "",
    scissors: "",
    lizard: "",
    spock: "",
  },
}));

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
});
