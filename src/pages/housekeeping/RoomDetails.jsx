import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BedDouble,
  User,
  Clock,
  CheckCircle,
  Square,
  AlertTriangle,
  Save,
  Play,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import Card from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Input';
import { useHousekeeping } from '../../hooks/useStaffPortal';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, updateRoom, updateRoomChecklist, updateRoomStatus, addRoomNote } = useHousekeeping();

  const room = useMemo(() => rooms.find(r => r.id === id), [rooms, id]);
  const [note, setNote] = useState(room?.notes || '');
  const [isSavingNote, setIsSavingNote] = useState(false);

  if (!room) {
    return (
      <div className="text-center py-16">
        <BedDouble className="w-16 h-16 text-text-muted mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-text mb-2">Room Not Found</h2>
        <p className="text-text-light mb-4">The room you're looking for doesn't exist.</p>
        <Button variant="outline" onClick={() => navigate('/housekeeping/rooms')}>
          Back to Rooms
        </Button>
      </div>
    );
  }

  const checklistProgress = useMemo(() => {
    const completed = room.checklist.filter(c => c.completed).length;
    return {
      completed,
      total: room.checklist.length,
      percentage: Math.round((completed / room.checklist.length) * 100)
    };
  }, [room.checklist]);

  const handleChecklistToggle = (checklistId, completed) => {
    updateRoomChecklist(room.id, checklistId, completed);
  };

  const handleStatusChange = (status) => {
    updateRoomStatus(room.id, status);
  };

  const handleSaveNote = () => {
    setIsSavingNote(true);
    addRoomNote(room.id, note);
    setTimeout(() => setIsSavingNote(false), 500);
  };

  const handleCompleteAll = () => {
    room.checklist.forEach(item => {
      if (!item.completed) {
        updateRoomChecklist(room.id, item.id, true);
      }
    });
  };

  return (
    <div>
      <PageHeader
        title={`Room ${room.roomNumber}`}
        subtitle={room.type}
        actions={
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate('/housekeeping/rooms')}
          >
            Back
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Status Card */}
          <Card>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`
                  w-16 h-16 rounded-[14px] flex items-center justify-center
                  ${room.status === 'dirty' ? 'bg-danger-light' :
                    room.status === 'in_progress' ? 'bg-warning-light' :
                    room.status === 'clean' ? 'bg-success-light' :
                    'bg-teal/10'}
                `}>
                  <BedDouble className={`w-8 h-8 ${
                    room.status === 'dirty' ? 'text-danger' :
                    room.status === 'in_progress' ? 'text-warning' :
                    room.status === 'clean' ? 'text-success' :
                    'text-teal'
                  }`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text">Room {room.roomNumber}</h2>
                  <p className="text-text-light">{room.type} - Floor {room.floor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={room.status} />
                {room.priority !== 'normal' && <PriorityBadge priority={room.priority} />}
              </div>
            </div>

            {/* Quick Status Actions */}
            <div className="flex flex-wrap gap-2">
              {room.status === 'dirty' && (
                <Button icon={Play} onClick={() => handleStatusChange('in_progress')}>
                  Start Cleaning
                </Button>
              )}
              {room.status === 'in_progress' && (
                <>
                  <Button
                    variant="success"
                    icon={Sparkles}
                    onClick={() => handleStatusChange('clean')}
                  >
                    Mark as Clean
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange('dirty')}
                  >
                    Reset to Dirty
                  </Button>
                </>
              )}
              {room.status === 'clean' && (
                <>
                  <Button
                    variant="teal"
                    icon={CheckCircle}
                    onClick={() => handleStatusChange('inspected')}
                  >
                    Mark Inspected
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange('dirty')}
                  >
                    Needs Re-Cleaning
                  </Button>
                </>
              )}
              {room.status === 'inspected' && (
                <div className="flex items-center gap-2 text-teal">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Room is ready for guest</span>
                </div>
              )}
            </div>
          </Card>

          {/* Checklist */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-text">Cleaning Checklist</h3>
                <p className="text-sm text-text-light">
                  {checklistProgress.completed} of {checklistProgress.total} completed
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompleteAll}
                disabled={checklistProgress.percentage === 100}
              >
                Complete All
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full h-3 bg-neutral-dark rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    checklistProgress.percentage === 100 ? 'bg-success' :
                    checklistProgress.percentage > 50 ? 'bg-teal' :
                    checklistProgress.percentage > 0 ? 'bg-warning' :
                    'bg-neutral-dark'
                  }`}
                  style={{ width: `${checklistProgress.percentage}%` }}
                />
              </div>
              <p className="text-right text-sm text-text-muted mt-1">
                {checklistProgress.percentage}% complete
              </p>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2">
              {room.checklist.map((item) => (
                <label
                  key={item.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-[10px] cursor-pointer transition-all
                    ${item.completed
                      ? 'bg-success-light/50 hover:bg-success-light'
                      : 'bg-neutral hover:bg-neutral-dark'}
                  `}
                >
                  <button
                    onClick={() => handleChecklistToggle(item.id, !item.completed)}
                    className={`
                      w-5 h-5 rounded flex items-center justify-center flex-shrink-0
                      ${item.completed
                        ? 'bg-success text-white'
                        : 'border-2 border-border bg-white'}
                    `}
                  >
                    {item.completed && <CheckCircle className="w-4 h-4" />}
                  </button>
                  <span className={`flex-1 ${item.completed ? 'line-through text-text-light' : 'text-text'}`}>
                    {item.task}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-text-muted" />
              <h3 className="text-lg font-semibold text-text">Notes</h3>
            </div>

            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add notes about this room..."
              rows={4}
            />

            <div className="flex justify-end mt-3">
              <Button
                size="sm"
                icon={Save}
                onClick={handleSaveNote}
                isLoading={isSavingNote}
              >
                Save Note
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Room Info */}
          <Card>
            <h3 className="text-lg font-semibold text-text mb-4">Room Information</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Guest</p>
                  <p className="font-medium text-text">{room.guestName || 'N/A'}</p>
                </div>
              </div>

              {room.guestCheckout && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-danger-light flex items-center justify-center">
                    <Clock className="w-5 h-5 text-danger" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Check-out</p>
                    <p className="font-medium text-text">{room.guestCheckout}</p>
                  </div>
                </div>
              )}

              {room.nextCheckin && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-success-light flex items-center justify-center">
                    <Clock className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Next Check-in</p>
                    <p className="font-medium text-text">{room.nextCheckin}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-beige/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-beige" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Last Cleaned</p>
                  <p className="font-medium text-text">{room.lastCleaned || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Special Requests */}
          {room.specialRequests && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-gold" />
                <h3 className="font-semibold text-text">Special Requests</h3>
              </div>
              <p className="text-sm text-text-light bg-gold/10 p-3 rounded-[10px]">
                {room.specialRequests}
              </p>
            </Card>
          )}

          {/* Priority Alert */}
          {(room.priority === 'urgent' || room.priority === 'high') && (
            <Card className={room.priority === 'urgent' ? 'border-danger' : 'border-warning'}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`w-5 h-5 ${room.priority === 'urgent' ? 'text-danger' : 'text-warning'}`} />
                <h3 className="font-semibold text-text">
                  {room.priority === 'urgent' ? 'Urgent Priority' : 'High Priority'}
                </h3>
              </div>
              <p className="text-sm text-text-light">
                {room.priority === 'urgent'
                  ? 'This room requires immediate attention. Please prioritize cleaning.'
                  : 'This room is marked as high priority. Complete as soon as possible.'}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
