import { useApp } from "../../App";
import { Zap } from "lucide-react";

export default function Header() {
  const app = useApp();
  if (!app) return null;

  const { levelInfo, journeyDay } = app;

  return (
    <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-dark-500/20">
      <div className="max-w-lg mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between">
          {/* Level badge */}
          <div className="flex items-center gap-2">
            <span className="text-lg">{levelInfo.icon}</span>
            <div>
              <p className="text-xs font-semibold text-white">
                Lv.{levelInfo.level} {levelInfo.title}
              </p>
              <p className="text-[10px] text-gray-500">Day {journeyDay}</p>
            </div>
          </div>

          {/* XP bar */}
          <div className="flex items-center gap-2 flex-1 ml-4">
            <div className="flex-1 h-2 bg-dark-600 rounded-full overflow-hidden">
              <div
                className="xp-bar-fill h-full"
                style={{ width: `${levelInfo.progress}%` }}
              />
            </div>
            <div className="flex items-center gap-0.5">
              <Zap size={12} className="text-brand-orange" />
              <span className="text-xs font-bold text-brand-orange">
                {levelInfo.totalXP}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
