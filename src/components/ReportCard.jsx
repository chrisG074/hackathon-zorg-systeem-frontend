import { Card } from '../components/ui/card';
import { Clock, CheckCircle2, Wrench, AlertCircle, User } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

export function ReportCard({ report, onClick }) {
  const getTypeIcon = () => {
    switch (report.type) {
      case 'facilitair':
        return <Wrench className="h-5 w-5" />;
      case 'mic':
        return <AlertCircle className="h-5 w-5" />;
      case 'mim':
        return <User className="h-5 w-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (report.type) {
      case 'facilitair':
        return 'Facilitair';
      case 'mic':
        return 'MIC (Cliënt)';
      case 'mim':
        return 'MIM (Medewerker)';
    }
  };

  const getTypeColor = () => {
    switch (report.type) {
      case 'facilitair':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'mic':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'mim':
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${getTypeColor()}`}>
            {getTypeIcon()}
          </div>
          <div>
            <p className="font-semibold text-sm">{getTypeLabel()}</p>
            <p className="text-xs text-muted-foreground">{report.timestamp}</p>
          </div>
          <div>
            <h3 className="font-medium">{getTypeLabel()}</h3>
            <p className="text-sm text-gray-500">
              {format(report.createdAt, 'PPp', { locale: nl })}
            </p>
          </div>
        </div>
        <Badge
          variant={report.status === 'afgerond' ? 'default' : 'secondary'}
          className="flex items-center gap-1"
        >
          {report.status === 'afgerond' ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Afgerond
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" />
              In behandeling
            </>
          )}
        </Badge>
      </div>
      
      <div className="text-sm text-gray-700">
        {report.type === 'facilitair' && (
          <>
            <p><strong>Locatie:</strong> {report.location}</p>
            <p><strong>Type:</strong> {report.equipmentType}</p>
            {report.isUrgent && (
              <Badge variant="destructive" className="mt-2">Spoed</Badge>
            )}
          </>
        )}
        {report.type === 'mic' && (
          <>
            <p><strong>Cliënt:</strong> {report.clientName}</p>
            <p><strong>Locatie:</strong> {report.bodyLocation.join(', ')}</p>
          </>
        )}
        {report.type === 'mim' && (
          <>
            <p><strong>Categorie:</strong> {report.category}</p>
            <p><strong>Leidinggevende:</strong> {report.supervisor}</p>
          </>
        )}
      </div>
    </Card>
  );
}
