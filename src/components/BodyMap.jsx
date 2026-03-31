export function BodyMap({ selectedLocations, onLocationSelect }) {
  const bodyParts = [
    { id: 'hoofd', label: 'Hoofd', x: 50, y: 10 },
    { id: 'linker-schouder', label: 'Linker schouder', x: 35, y: 25 },
    { id: 'rechter-schouder', label: 'Rechter schouder', x: 65, y: 25 },
    { id: 'borst', label: 'Borst', x: 50, y: 30 },
    { id: 'linker-arm', label: 'Linker arm', x: 25, y: 40 },
    { id: 'rechter-arm', label: 'Rechter arm', x: 75, y: 40 },
    { id: 'buik', label: 'Buik', x: 50, y: 45 },
    { id: 'linker-heup', label: 'Linker heup', x: 40, y: 55 },
    { id: 'rechter-heup', label: 'Rechter heup', x: 60, y: 55 },
    { id: 'linker-bovenbeen', label: 'Linker bovenbeen', x: 40, y: 68 },
    { id: 'rechter-bovenbeen', label: 'Rechter bovenbeen', x: 60, y: 68 },
    { id: 'linker-onderbeen', label: 'Linker onderbeen', x: 40, y: 82 },
    { id: 'rechter-onderbeen', label: 'Rechter onderbeen', x: 60, y: 82 },
    { id: 'linker-voet', label: 'Linker voet', x: 40, y: 95 },
    { id: 'rechter-voet', label: 'Rechter voet', x: 60, y: 95 },
  ];

  const toggleLocation = (location) => {
    if (selectedLocations.includes(location)) {
      onLocationSelect(selectedLocations.filter((l) => l !== location));
    } else {
      onLocationSelect([...selectedLocations, location]);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-auto">
        {/* Head */}
        <circle
          cx="50"
          cy="10"
          r="5"
          className={`cursor-pointer transition-all ${
            selectedLocations.includes('hoofd')
              ? 'fill-red-500 stroke-red-700'
              : 'fill-blue-200 stroke-blue-400 hover:fill-blue-300'
          }`}
          strokeWidth="0.5"
          onClick={() => toggleLocation('hoofd')}
        />
        
        {/* Body */}
        <ellipse
          cx="50"
          cy="32"
          rx="8"
          ry="12"
          className={`cursor-pointer transition-all ${
            selectedLocations.includes('borst')
              ? 'fill-red-500 stroke-red-700'
              : 'fill-blue-200 stroke-blue-400 hover:fill-blue-300'
          }`}
          strokeWidth="0.5"
          onClick={() => toggleLocation('borst')}
        />
        
        {/* Arms */}
        <line
          x1="42"
          y1="26"
          x2="25"
          y2="45"
          className={`cursor-pointer transition-all ${
            selectedLocations.includes('linker-arm')
              ? 'stroke-red-500'
              : 'stroke-blue-400 hover:stroke-blue-500'
          }`}
          strokeWidth="3"
          strokeLinecap="round"
          onClick={() => toggleLocation('linker-arm')}
        />
        <line
          x1="58"
          y1="26"
          x2="75"
          y2="45"
          className={`cursor-pointer transition-all ${
            selectedLocations.includes('rechter-arm')
              ? 'stroke-red-500'
              : 'stroke-blue-400 hover:stroke-blue-500'
          }`}
          strokeWidth="3"
          strokeLinecap="round"
          onClick={() => toggleLocation('rechter-arm')}
        />
        
        {/* Abdomen */}
        <ellipse
          cx="50"
          cy="48"
          rx="7"
          ry="8"
          className={`cursor-pointer transition-all ${
            selectedLocations.includes('buik')
              ? 'fill-red-500 stroke-red-700'
              : 'fill-blue-200 stroke-blue-400 hover:fill-blue-300'
          }`}
          strokeWidth="0.5"
          onClick={() => toggleLocation('buik')}
        />
        
        {/* Legs */}
        <line
          x1="45"
          y1="56"
          x2="42"
          y2="80"
          className={`cursor-pointer transition-all ${
            selectedLocations.includes('linker-bovenbeen')
              ? 'stroke-red-500'
              : 'stroke-blue-400 hover:stroke-blue-500'
          }`}
          strokeWidth="4"
          strokeLinecap="round"
          onClick={() => toggleLocation('linker-bovenbeen')}
        />
        <line
          x1="55"
          y1="56"
          x2="58"
          y2="80"
          className={`cursor-pointer transition-all ${
            selectedLocations.includes('rechter-bovenbeen')
              ? 'stroke-red-500'
              : 'stroke-blue-400 hover:stroke-blue-500'
          }`}
          strokeWidth="4"
          strokeLinecap="round"
          onClick={() => toggleLocation('rechter-bovenbeen')}
        />
        
        <line
          x1="42"
          y1="80"
          x2="40"
          y2="95"
          className={`cursor-pointer transition-all ${
            selectedLocations.includes('linker-onderbeen')
              ? 'stroke-red-500'
              : 'stroke-blue-400 hover:stroke-blue-500'
          }`}
          strokeWidth="3"
          strokeLinecap="round"
          onClick={() => toggleLocation('linker-onderbeen')}
        />
        <line
          x1="58"
          y1="80"
          x2="60"
          y2="95"
          className={`cursor-pointer transition-all ${
            selectedLocations.includes('rechter-onderbeen')
              ? 'stroke-red-500'
              : 'stroke-blue-400 hover:stroke-blue-500'
          }`}
          strokeWidth="3"
          strokeLinecap="round"
          onClick={() => toggleLocation('rechter-onderbeen')}
        />
      </svg>
      
      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium">Geselecteerde locaties:</p>
        <div className="flex flex-wrap gap-2">
          {selectedLocations.length === 0 ? (
            <span className="text-sm text-gray-500">Geen locaties geselecteerd</span>
          ) : (
            selectedLocations.map((location) => (
              <span
                key={location}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
              >
                {bodyParts.find((bp) => bp.id === location)?.label || location}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
