import { ScheduledTask, ChildProfile } from '@/types/domain';

export function generateFamilyIcsCalendar(tasks: ScheduledTask[], children: ChildProfile[]): string {
  const childMap = new Map(children.map((c) => [c.id, c]));
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const events = tasks.map((t) => {
    const child = childMap.get(t.childId);
    const [hh, mm] = (t.scheduledStartTime || '15:30').split(':').map(Number);
    const startH = String(hh).padStart(2, '0');
    const startM = String(mm).padStart(2, '0');

    const totalEndMinutes = hh * 60 + mm + t.defaultDurationMinutes;
    const endH = String(Math.floor(totalEndMinutes / 60) % 24).padStart(2, '0');
    const endM = String(totalEndMinutes % 60).padStart(2, '0');

    return [
      'BEGIN:VEVENT',
      `UID:${t.id}@nuvoriq-family-hub.org`,
      `DTSTAMP:${todayStr}T120000Z`,
      `DTSTART:${todayStr}T${startH}${startM}00`,
      `DTEND:${todayStr}T${endH}${endM}00`,
      `SUMMARY:[${child?.name || 'Child'} • ${t.energyLoad}] ${t.title}`,
      `DESCRIPTION:Pillar: ${t.pillar} | Energy Load: ${t.energyLoad} | Runway 10m: ${t.runwayWarning10MinText}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT10M',
      'ACTION:DISPLAY',
      `DESCRIPTION:${t.runwayWarning10MinText}`,
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-PT3M',
      'ACTION:DISPLAY',
      `DESCRIPTION:${t.runwayWarning3MinText}`,
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nuvoriq Family Executive Functioning Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

export function parseImportedIcsEvents(icsContent: string, defaultChildId: string): Partial<ScheduledTask>[] {
  const blocks = icsContent.split('BEGIN:VEVENT').slice(1);
  return blocks.map((block, idx) => {
    const summaryMatch = block.match(/SUMMARY:(.*)/);
    const dtStartMatch = block.match(/DTSTART.*:(\d{8}T(\d{2})(\d{2})\d{2})/);
    const rawSummary = summaryMatch ? summaryMatch[1].trim() : `Imported Calendar Activity #${idx + 1}`;
    const startTime = dtStartMatch ? `${dtStartMatch[2]}:${dtStartMatch[3]}` : '16:15';

    return {
      childId: defaultChildId,
      title: rawSummary.replace(/^\[.*?\]\s*/, ''),
      subtitle: 'Synced via Two-Way .ICS Calendar Bridge',
      pillar: rawSummary.toLowerCase().includes('math') || rawSummary.toLowerCase().includes('science')
        ? 'ACADEMIC_MASTERY'
        : rawSummary.toLowerCase().includes('karate') || rawSummary.toLowerCase().includes('swim') || rawSummary.toLowerCase().includes('dance')
        ? 'DISCIPLINES_ARTS'
        : 'EXECUTIVE_HABITS',
      energyLoad: rawSummary.toLowerCase().includes('play') || rawSummary.toLowerCase().includes('rest')
        ? 'RESTORATIVE'
        : 'HIGH_COGNITIVE',
      scheduledStartTime: startTime,
      defaultDurationMinutes: 30,
      status: 'SCHEDULED',
    };
  });
}
