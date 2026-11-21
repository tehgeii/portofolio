import { expect, test } from "@playwright/test";
import { journeyAt } from "../src/data/journey";
import { semesterAt, semesterPeriod } from "../src/lib/semester";

test.skip(({ isMobile }) => isMobile, "Pure logic: one browser project is enough.");

test("semester follows the UDINUS calendar", () => {
  const at = (iso: string) => semesterAt(new Date(`${iso}T12:00:00`));
  expect(at("2024-08-31")).toBeNull();
  expect(at("2024-09-01")).toBe(1);
  expect(at("2025-01-20")).toBe(1);
  expect(at("2025-02-03")).toBe(2);
  expect(at("2026-08-15")).toBe(4);
  expect(at("2026-11-21")).toBe(5);
  expect(at("2027-02-01")).toBe(6);
  expect(at("2028-09-01")).toBeNull();
  expect(semesterPeriod(4, false)).toEqual({ id: "Feb – Jul 2026", en: "Feb – Jul 2026" });
  expect(semesterPeriod(5, false).en).toBe("Sep 2026 – Jan 2027");
  expect(semesterPeriod(5, true)).toEqual({ id: "Sep 2026 – Sekarang", en: "Sep 2026 – Present" });
});

test("the journey marks exactly the running semester as now", () => {
  const nov2026 = journeyAt(new Date("2026-11-21T12:00:00"));
  expect(nov2026.filter((i) => i.current).map((i) => i.semester)).toEqual([5]);

  // A new semester without its own entry yet gets a placeholder on top.
  const mar2027 = journeyAt(new Date("2027-03-10T12:00:00"));
  expect(mar2027[0]).toMatchObject({ semester: 6, current: true });
  expect(mar2027.find((i) => i.semester === 5)?.period.id).toBe("Sep 2026 – Jan 2027");
});
