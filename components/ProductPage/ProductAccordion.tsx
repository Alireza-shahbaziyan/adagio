import type { Dispatch, SetStateAction } from "react";
import { ChevronDownIcon } from "@/components/icons";

export default function ProductAccordion({
  sections,
  openKey,
  setOpenKey,
}: {
  sections: { key: string; title: string; content: string }[];
  openKey: string | null;
  setOpenKey: Dispatch<SetStateAction<string | null>>;
}) {
  if (sections.length === 0) return null;

  return (
    <div className="border-t border-white/8">
      {sections.map((a) => {
        const isOpen = openKey === a.key;
        return (
          <div key={a.key} className="border-b border-white/8">
            <button
              onClick={() => setOpenKey(isOpen ? null : a.key)}
              className="flex w-full items-center justify-between py-5 text-right text-sm text-foreground"
            >
              {a.title}
              <span
                className="inline-flex transition-transform"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <ChevronDownIcon />
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-400 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="mb-5 text-sm leading-[1.9] text-muted-foreground">
                  {a.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
