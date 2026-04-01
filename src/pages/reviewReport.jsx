import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { ArrowLeft, Edit2, Check } from 'lucide-react';

export default function ReviewReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, type } = location.state ?? {};
  
  const [editableData, setEditableData] = useState(formData ?? {});
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    if (!formData || !type) {
      navigate('/');
    }
  }, [formData, navigate, type]);

  if (!formData || !type) {
    return null;
  }

  const handleFieldEdit = (field, value) => {
    setEditableData({ ...editableData, [field]: value });
  };

  const handleSubmit = () => {
    // In a real app, this would send to backend
    console.log('Submitting report:', { type, data: editableData });
    navigate('/bevestiging', { state: { type } });
  };

  const renderField = (label, field, value, fieldType = 'text') => {
    const isEditing = editingField === field;

    return (
      <div className="space-y-2">
        <Label className="text-base font-semibold">{label}</Label>
        {isEditing ? (
          <div className="flex gap-2">
            {fieldType === 'textarea' ? (
              <Textarea
                value={editableData[field]}
                onChange={(e) => handleFieldEdit(field, e.target.value)}
                className="flex-1"
                rows={4}
              />
            ) : fieldType === 'boolean' ? (
              <div className="flex gap-4">
                <Button
                  variant={editableData[field] === true ? 'default' : 'outline'}
                  onClick={() => handleFieldEdit(field, true)}
                >
                  Ja
                </Button>
                <Button
                  variant={editableData[field] === false ? 'default' : 'outline'}
                  onClick={() => handleFieldEdit(field, false)}
                >
                  Nee
                </Button>
              </div>
            ) : (
              <Input
                value={editableData[field]}
                onChange={(e) => handleFieldEdit(field, e.target.value)}
                className="flex-1"
              />
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditingField(null)}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-900">
              {fieldType === 'boolean'
                ? value
                  ? 'Ja'
                  : 'Nee'
                : Array.isArray(value)
                ? value.join(', ')
                : value || '-'}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditingField(field)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Controleer je melding</h1>
          <p className="text-gray-600">
            Controleer de gegevens en pas aan waar nodig. Klik op het potlood-icoon om te bewerken.
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b">
            <h2 className="text-xl font-semibold capitalize">{type} Melding</h2>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {type === 'facilitair' && (
            <>
              {renderField('Locatie/Ruimte', 'location', editableData.location)}
              {renderField('Type hulpmiddel', 'equipmentType', editableData.equipmentType)}
              {renderField('Spoed (€152,75)', 'isUrgent', editableData.isUrgent, 'boolean')}
              {renderField('Omschrijving', 'description', editableData.description, 'textarea')}
            </>
          )}

          {type === 'mic' && (
            <>
              {renderField('Naam cliënt', 'clientName', editableData.clientName)}
              {renderField('Locatie letsel', 'bodyLocation', editableData.bodyLocation)}
              {renderField('Gezondheidsklachten', 'healthComplaints', editableData.healthComplaints)}
              {renderField('Toedracht', 'description', editableData.description, 'textarea')}
            </>
          )}

          {type === 'mim' && (
            <>
              {renderField('Categorie', 'category', editableData.category)}
              {renderField('Toedracht', 'description', editableData.description, 'textarea')}
              {renderField('Leidinggevende', 'supervisor', editableData.supervisor)}
              {renderField('Arbeidsverzuim', 'workAbsence', editableData.workAbsence, 'boolean')}
            </>
          )}
        </Card>

        <div className="flex gap-4">
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={() => navigate(-1)}
          >
            Opnieuw invullen
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleSubmit}
          >
            <Check className="h-5 w-5 mr-2" />
            Verzenden
          </Button>
        </div>
      </div>
    </div>
  );
}
