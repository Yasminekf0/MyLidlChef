function Journey({ onBack, onContinue }) {
  return (
    <div className="min-h-screen flex flex-col bg-white max-w-[390px] mx-auto overflow-y-auto">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
          50% { box-shadow: 0 0 0 20px rgba(255, 215, 0, 0); }
        }
        .journey-node-1 { animation: slideUp 0.5s ease-out 0ms forwards; opacity: 0; }
        .journey-node-2 { animation: slideUp 0.5s ease-out 200ms forwards; opacity: 0; }
        .journey-node-3 { animation: slideUp 0.5s ease-out 400ms forwards; opacity: 0; }
        .pulse-glow { animation: pulseGlow 1.5s ease-in-out infinite; }
      `}</style>

      {/* Header - 56px tall */}
      <header
        className="relative flex items-center justify-between px-4 shrink-0"
        style={{ backgroundColor: '#0050AA', height: '56px' }}
      >
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors shrink-0 z-10"
          aria-label="Back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-nunito font-bold text-white" style={{ fontSize: '20px' }}>
          Min Madrejse
        </h1>
        <div
          className="px-3 py-1.5 rounded-full font-nunito font-bold text-sm shrink-0 z-10"
          style={{ backgroundColor: '#FFD700', color: '#0050AA' }}
        >
          142 XP
        </div>
      </header>

      {/* Level Banner */}
      <div className="px-4 pt-4 pb-2">
        <div
          className="rounded-xl shadow-sm"
          style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
        >
          <p className="font-nunito font-bold text-gray-900 mb-1" style={{ fontSize: '22px' }}>
            Begynder Kok 👨‍🍳
          </p>
          <p className="font-dm-sans text-gray-500 mb-3" style={{ fontSize: '14px' }}>
            42% til næste niveau: Øvet Kok
          </p>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: '12px', backgroundColor: '#e5e7eb' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: '42%', backgroundColor: '#0050AA' }}
            />
          </div>
        </div>
      </div>

      {/* Journey Path - centered flex-col */}
      <div className="flex-1 flex flex-col items-center overflow-y-auto px-4 py-6">
        {/* Node 1 - COMPLETED */}
        <div className="flex flex-col items-center mb-12 journey-node-1">
          <div
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2"
            style={{ backgroundColor: '#22c55e', color: 'white' }}
          >
            GENNEMFØRT
          </div>
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-md shrink-0"
            style={{ width: '96px', height: '96px', backgroundColor: '#0050AA' }}
          >
            <span className="text-white font-bold" style={{ fontSize: '40px' }}>✓</span>
          </div>
          <h3 className="font-nunito font-bold mt-3 text-center" style={{ fontSize: '18px', color: '#0050AA' }}>
            Opskrift Mester
          </h3>
          <p className="font-dm-sans text-gray-500 text-center mt-1" style={{ fontSize: '14px' }}>
            Find din første opskrift
          </p>
          <div className="flex gap-1 mt-2">
            <span style={{ fontSize: '16px' }}>⭐</span>
            <span style={{ fontSize: '16px' }}>⭐</span>
            <span style={{ fontSize: '16px' }}>⭐</span>
          </div>
        </div>

        {/* Dashed connector - 40px tall */}
        <div
          className="shrink-0 self-center"
          style={{
            width: 1,
            height: '40px',
            marginBottom: '48px',
            borderLeft: '3px dashed #ccc',
          }}
        />

        {/* Node 2 - CURRENT */}
        <div className="flex flex-col items-center mb-12 journey-node-2">
          {/* Speech bubble above circle */}
          <div
            className="relative px-4 py-2 rounded-xl mb-2"
            style={{ backgroundColor: '#0050AA', color: 'white', boxShadow: '0 2px 8px rgba(0,80,170,0.25)' }}
          >
            <span className="font-nunito font-semibold whitespace-nowrap" style={{ fontSize: '14px' }}>
              Du er her! 👇
            </span>
            {/* Downward triangle pointer */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: '100%',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid #0050AA',
              }}
            />
          </div>
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center pulse-glow shrink-0"
            style={{ width: '96px', height: '96px', backgroundColor: '#FFD700' }}
          >
            <span style={{ fontSize: '40px' }}>🍳</span>
          </div>
          <h3 className="font-nunito font-bold mt-3 text-center" style={{ fontSize: '18px', color: '#0050AA' }}>
            Spar Smart
          </h3>
          <p className="font-dm-sans text-gray-500 text-center mt-1" style={{ fontSize: '14px' }}>
            Brug dagens tilbud
          </p>
          <div className="flex gap-1 mt-2">
            <span style={{ fontSize: '16px' }}>⭐</span>
            <span style={{ fontSize: '16px', opacity: 0.3 }}>☆</span>
            <span style={{ fontSize: '16px', opacity: 0.3 }}>☆</span>
          </div>
        </div>

        {/* Dashed connector */}
        <div
          className="shrink-0 self-center"
          style={{
            width: 1,
            height: '40px',
            marginBottom: '48px',
            borderLeft: '3px dashed #ccc',
          }}
        />

        {/* Node 3 - LOCKED */}
        <div className="flex flex-col items-center mb-12 journey-node-3 opacity-60">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shrink-0"
            style={{ width: '96px', height: '96px', backgroundColor: '#CCCCCC' }}
          >
            <span style={{ fontSize: '36px' }}>🔒</span>
          </div>
          <h3 className="font-nunito font-bold mt-3 text-center text-gray-500" style={{ fontSize: '18px' }}>
            Mester Kok
          </h3>
          <p className="font-dm-sans text-gray-400 text-center mt-1" style={{ fontSize: '14px' }}>
            Del dit færdige måltid og få point
          </p>
          <div className="flex gap-1 mt-2">
            <span style={{ fontSize: '16px', opacity: 0.3 }}>☆</span>
            <span style={{ fontSize: '16px', opacity: 0.3 }}>☆</span>
            <span style={{ fontSize: '16px', opacity: 0.3 }}>☆</span>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-4 pb-6 pt-2 shrink-0">
        <button
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 font-nunito font-bold transition-transform active:scale-[0.97] shadow-md rounded-2xl"
          style={{
            backgroundColor: '#FFD700',
            color: '#0050AA',
            height: '56px',
            fontSize: '18px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.35)',
          }}
        >
          Fortsæt Rejsen →
        </button>
      </div>
    </div>
  );
}

export default Journey;
