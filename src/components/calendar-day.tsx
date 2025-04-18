"use client";

import { format } from "date-fns";
import { useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

interface CalendarDayProps {
  date: string;
  destinations?: Array<{ name: string; location: string }>;
  showPopup?: boolean;
  popupContent?: { name: string; location: string };
  geoapifyPlaceId?: string;
  locationLabel?: string;
  isSelected: boolean;
  onClick: (date: string) => void;
}

export default function CalendarDay({
  date,
  geoapifyPlaceId,
  locationLabel,
  showPopup = false,
  popupContent,
  isSelected,
  onClick,
}: CalendarDayProps) {
  const { setNodeRef } = useDroppable({ id: date, data: { date } });

  const [showLocalPopup, setShowLocalPopup] = useState(false);
  const [y, m, d] = date.split("-").map(Number);
  const displayDate = format(new Date(y, m - 1, d), "MMM d");

  useEffect(() => {
    if (showPopup && popupContent) {
      setShowLocalPopup(true);
      const timer = setTimeout(() => setShowLocalPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, popupContent]);

  return (
    <div
      ref={setNodeRef}
      onClick={() => {
        if (geoapifyPlaceId) {
          onClick(date);
        }
      }}
      className={`relative border border-border rounded p-2 h-65 w-full transition hover:bg-muted/30 cursor-pointer 
        ${isSelected ? "bg-accent border-ring" : "bg-background"}
      `}
      data-date={date}
    >
      {showLocalPopup && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-3 py-1 rounded-md text-sm whitespace-nowrap z-10">
          Added {popupContent?.name}
        </div>
      )}
      <span className="absolute bottom-2 left-2 text-xs text-muted-foreground">
        {displayDate}
      </span>
    </div>
  );
}
