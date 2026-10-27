import React, { useState } from 'react';
import { RoutineTask } from '../types';
import { Plus, CheckCircle2, Trash2, Edit3, X, Check, RotateCcw, EyeOff, Eye, Clock, CalendarDays } from 'lucide-react';

interface RoutineListProps {
  tasks: RoutineTask[];
  onToggleTask: (index: number) => void;
  onToggleTaskEnabled?: (id: string) => void;
  onAddTask: (task: Omit<RoutineTask, 'id'>) => void;
  onEditTask: (id: string, updated: Partial<RoutineTask>) => void;
  onDeleteTask: (id: string) => void;
  onResetTasks: () => void;
  onRestoreDefaults?: () => void;
  onClearAll?: () => void;
}

export const RoutineList: React.FC<RoutineListProps> = ({
  tasks,
  onToggleTask,
  onToggleTaskEnabled,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onResetTasks,
  onRestoreDefaults,
  onClearAll,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showManageMenu, setShowManageMenu] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');

  // Edit task form state
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');

  // Only active/enabled tasks count toward today's protocol progress
  const activeTasks = tasks.filter((t) => t.enabled !== false);
  const completedCount = activeTasks.filter((t) => t.done).length;
  const totalCount = activeTasks.length;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allComplete = totalCount > 0 && completedCount === totalCount;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      time: newTime.trim() || 'Flexible Time',
      done: false,
      enabled: true,
    });
    setNewTitle('');
    setNewTime('');
    setIsAdding(false);
  };

  const startEditing = (task: RoutineTask) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditTime(task.time);
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    onEditTask(id, {
      title: editTitle.trim(),
      time: editTime.trim() || 'Flexible Time',
    });
    setEditingId(null);
  };

  const timeQuickPresets = [
    '06:30 AM',
    '09:00 AM - 11:30 AM',
    '01:00 PM - 03:00 PM',
    '04:00 PM - 08:30 PM',
    '10:30 PM',
    'Flexible Time',
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Header bar with progress */}
      <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays size={15} className="text-[#ff2a4b]" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Today's Timetable
          </span>
          <span className="text-xs font-mono text-[#ff4d6a] font-bold">
            [{completedCount}/{totalCount} Active]
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {completedCount > 0 && (
            <button
              onClick={onResetTasks}
              title="Reset today's checks"
              className="text-[11px] py-1 px-2 rounded bg-[#181c28] hover:bg-[#222738] text-slate-300 hover:text-white border border-[#272d40] transition-colors flex items-center gap-1 font-semibold uppercase tracking-wider"
            >
              <RotateCcw size={12} />
              Reset Checks
            </button>
          )}

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-[11px] py-1 px-2.5 rounded bg-[#8b0000] hover:bg-[#b00d0d] text-white border border-[#ff2a4b] transition-colors flex items-center gap-1 font-bold uppercase tracking-wider shadow"
          >
            <Plus size={13} />
            Add Task
          </button>

          {(onRestoreDefaults || onClearAll) && (
            <button
              onClick={() => setShowManageMenu(!showManageMenu)}
              title="Customize timetable options"
              className="text-[11px] py-1 px-2 rounded bg-[#181c28] hover:bg-[#222738] text-slate-400 hover:text-white border border-[#272d40] transition-colors font-semibold"
            >
              ···
            </button>
          )}
        </div>
      </div>

      {/* Routine management dropdown options */}
      {showManageMenu && (
        <div className="p-3 bg-[#121520] border border-[#1e2230] rounded-xl space-y-2 text-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Timetable Customization
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {onClearAll && tasks.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Delete all tasks and create your own timetable?')) {
                    onClearAll();
                    setShowManageMenu(false);
                  }
                }}
                className="py-1 px-2.5 rounded text-[#ff4d6a] hover:bg-[#ff2a4b]/15 border border-[#ff2a4b]/30 font-bold uppercase text-[10px] tracking-wider transition-colors"
              >
                Clear All / Blank Slate
              </button>
            )}

            {onRestoreDefaults && (
              <button
                onClick={() => {
                  onRestoreDefaults();
                  setShowManageMenu(false);
                }}
                className="py-1 px-2.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 font-bold uppercase text-[10px] tracking-wider transition-colors"
              >
                Restore Default Schedule
              </button>
            )}

            <button
              onClick={() => setShowManageMenu(false)}
              className="py-1 px-2 rounded text-slate-500 hover:text-slate-300 text-[10px] uppercase font-bold ml-auto"
            >
              Close
            </button>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            💡 You can edit any time, delete any block, or click the eye icon to skip tasks you aren't doing today.
          </p>
        </div>
      )}

      {/* Routine completion progress meter */}
      <div className="w-full bg-[#12141c] h-1.5 rounded-full overflow-hidden border border-[#1e2230]">
        <div
          className={`h-full transition-all duration-300 ${
            allComplete && totalCount > 0
              ? 'bg-white shadow-[0_0_10px_#fff]'
              : 'bg-[#ff2a4b]'
          }`}
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      {/* Add Task Collapsible Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="p-3.5 bg-[#121520] border border-[#ff2a4b]/40 rounded-xl space-y-3 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#ff8093] uppercase tracking-wider">
              Add Custom Timetable Block
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Task Name:
              </label>
              <input
                type="text"
                placeholder="e.g. Physics Problem Solving, Gym, etc."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0c12] border border-[#222736] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff2a4b]"
                autoFocus
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Time Interval:
              </label>
              <input
                type="text"
                placeholder="e.g. 05:00 PM - 06:30 PM"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0c12] border border-[#222736] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff2a4b]"
              />
            </div>
          </div>

          {/* Quick Preset times */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1">
              {timeQuickPresets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setNewTime(preset)}
                  className="py-0.5 px-2 rounded bg-[#181c28] hover:bg-[#222738] text-[10px] text-slate-400 hover:text-white border border-[#222738] transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-[#1e2230]">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#8b0000] hover:bg-[#a60b0b] text-white text-xs font-bold uppercase tracking-wider shadow"
            >
              Save to Timetable
            </button>
          </div>
        </form>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="p-6 bg-[#10121a] border border-[#1e2230] rounded-xl text-center space-y-3">
          <p className="text-xs text-slate-400">Timetable is empty. Create your own custom schedule!</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setIsAdding(true)}
              className="py-1.5 px-3 rounded-lg bg-[#8b0000] text-white text-xs font-bold uppercase tracking-wider"
            >
              Add New Task
            </button>
            {onRestoreDefaults && (
              <button
                onClick={onRestoreDefaults}
                className="py-1.5 px-3 rounded-lg bg-[#181c28] text-slate-300 text-xs font-bold uppercase tracking-wider border border-[#272d40]"
              >
                Restore Default Schedule
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-2">
        {tasks.map((task, index) => {
          const isEditing = editingId === task.id;
          const isConfirmingDelete = confirmDeleteId === task.id;
          const isEnabled = task.enabled !== false;

          if (isEditing) {
            return (
              <div
                key={task.id}
                className="p-3.5 bg-[#151824] border border-[#ff2a4b] rounded-xl space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#ff8093] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={13} />
                    Adjust Timetable Task
                  </span>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      Task Title:
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#0d0f17] border border-[#272d3e] rounded text-xs text-white focus:outline-none focus:border-[#ff2a4b]"
                      placeholder="Task title"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      Time / Schedule:
                    </label>
                    <input
                      type="text"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#0d0f17] border border-[#272d3e] rounded text-xs text-white focus:outline-none focus:border-[#ff2a4b]"
                      placeholder="e.g. 09:00 AM - 11:30 AM"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {timeQuickPresets.map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setEditTime(preset)}
                        className="py-0.5 px-2 rounded bg-[#0f121a] hover:bg-[#1a1e2b] text-[10px] text-slate-400 hover:text-white border border-[#222736]"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-[#23283a]">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(task.id)}
                    className="px-3.5 py-1 bg-[#ff2a4b] hover:bg-[#e01939] text-white rounded text-xs font-bold uppercase tracking-wider shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all ${
                !isEnabled
                  ? 'bg-[#090b10] border-[#151722] opacity-40'
                  : task.done
                  ? 'bg-[#0c0e14] border-[#151824] opacity-55'
                  : 'bg-[#10121a] border-[#1e2230] hover:border-[#2d3348]'
              }`}
            >
              {/* Left: Clickable Title & Time */}
              <div
                className="flex-1 mr-2 cursor-pointer select-none py-0.5"
                onClick={() => {
                  if (isEnabled) onToggleTask(index);
                }}
              >
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-xs sm:text-sm font-semibold tracking-wide transition-all ${
                      !isEnabled
                        ? 'line-through text-slate-500'
                        : task.done
                        ? 'line-through text-slate-400'
                        : 'text-slate-100'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.done && isEnabled && (
                    <CheckCircle2 size={13} className="text-[#ff2a4b] shrink-0" />
                  )}
                  {!isEnabled && (
                    <span className="text-[10px] font-bold text-amber-500/80 bg-amber-950/40 border border-amber-900/40 px-1.5 py-0.2 rounded">
                      Skipped Today
                    </span>
                  )}
                </div>

                {/* Clickable time badge for fast inline adjustment */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(task);
                  }}
                  className="text-[11px] font-bold text-[#ff4d6a] hover:text-white tracking-wider mt-0.5 font-mono inline-flex items-center gap-1 cursor-pointer"
                  title="Click to adjust time"
                >
                  <Clock size={11} className="text-[#ff4d6a]" />
                  <span>{task.time}</span>
                  <span className="text-[10px] text-slate-500 font-normal">✎</span>
                </div>
              </div>

              {/* Right Action Cluster: Skip/Enable, Edit, Delete, Checkbox */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Delete confirmation inline */}
                {isConfirmingDelete ? (
                  <div className="flex items-center gap-1 bg-[#26050e] border border-[#ff2a4b] p-1 rounded-lg">
                    <span className="text-[10px] text-[#fecdd3] font-bold uppercase px-1">
                      Delete?
                    </span>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="px-2 py-1 bg-[#ff2a4b] hover:bg-[#d91435] text-white text-[10px] font-black rounded uppercase"
                      title="Confirm delete"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-1.5 py-1 text-slate-400 hover:text-white text-[10px] rounded"
                      title="Cancel"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* TOGGLE SKIP/ACTIVE FOR TODAY */}
                    {onToggleTaskEnabled && (
                      <button
                        onClick={() => onToggleTaskEnabled(task.id)}
                        title={
                          isEnabled
                            ? "Skip this task for today (exempt from victory calculation)"
                            : "Include this task in today's timetable"
                        }
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isEnabled
                            ? 'text-slate-400 hover:text-amber-400 hover:bg-[#1a1e2b]'
                            : 'text-amber-400 bg-amber-950/40 border border-amber-900/50'
                        }`}
                      >
                        {isEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    )}

                    {/* EDIT BUTTON */}
                    <button
                      onClick={() => startEditing(task)}
                      title="Adjust task title or time"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1a1e2b] transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => setConfirmDeleteId(task.id)}
                      title="Delete this task"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#ff2a4b] hover:bg-[#ff2a4b]/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}

                {/* Checkbox (only if enabled) */}
                {isEnabled ? (
                  <label
                    className="w-9 h-9 flex items-center justify-center cursor-pointer ml-0.5"
                    title={task.done ? "Mark incomplete" : "Mark completed"}
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => onToggleTask(index)}
                      className="w-5 h-5 rounded cursor-pointer accent-[#ff2a4b] bg-[#1a1e2b] border-[#2c3246]"
                    />
                  </label>
                ) : (
                  <div
                    className="w-9 h-9 flex items-center justify-center text-slate-600 text-[10px] font-bold"
                    title="Task is skipped for today"
                  >
                    —
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
