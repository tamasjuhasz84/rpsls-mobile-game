import { describe, it, expect } from "vitest";
import { buildDailyMissionPack } from "@/utils/missions";

describe("missions utils", () => {
  it("ugyanarra a napra ugyanazt a mission pack-et adja", () => {
    const first = buildDailyMissionPack(new Date(2026, 2, 30, 9, 10, 0));
    const second = buildDailyMissionPack(new Date(2026, 2, 30, 23, 59, 59));

    expect(second).toStrictEqual(first);
  });

  it("különböző napra eltérő id készül", () => {
    const first = buildDailyMissionPack(new Date(2026, 2, 30));
    const second = buildDailyMissionPack(new Date(2026, 2, 31));

    expect(second.id).not.toBe(first.id);
  });

  it("mindig 3 mission készül és a várt típusokkal", () => {
    const pack = buildDailyMissionPack(new Date(2026, 2, 30));
    const types = pack.missions.map((mission) => mission.type);

    expect(pack.missions).toHaveLength(3);
    expect(types).toContain("round_wins");
    expect(types).toContain("win_streak");
    expect(types).toContain("move_wins");
  });
});
