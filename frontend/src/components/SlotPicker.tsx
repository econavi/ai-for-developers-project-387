import { useEffect, useState } from 'react';
import { Button, Paper, Text, Title, SimpleGrid } from '@mantine/core';
import { api } from '../lib/api';
import type { components } from '../lib/api.types';

type Slot = components['schemas']['Slot'];

interface SlotPickerProps {
  eventTypeId: string;
  durationMinutes: number;
  selectedSlot: Slot | null;
  onSelectSlot: (slot: Slot | null) => void;
}

export function SlotPicker({ eventTypeId, selectedSlot, onSelectSlot }: SlotPickerProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    onSelectSlot(null);

    api.GET('/api/event-types/{id}/slots', {
      params: { path: { id: eventTypeId } },
    }).then(({ data, error: err }) => {
      if (data) {
        setSlots(data.slots);
      } else {
        setError(err ? 'Ошибка загрузки слотов' : 'Нет доступных слотов');
      }
      setLoading(false);
    });
  }, [eventTypeId]);

  if (loading) {
    return <Text>Загрузка слотов...</Text>;
  }

  if (error) {
    return <Text c="red">{error}</Text>;
  }

  if (slots.length === 0) {
    return <Text>Нет доступных слотов на ближайшие 14 дней</Text>;
  }

  return (
    <Paper withBorder p="md" radius="md">
      <Title order={4} mb="sm">Доступные слоты</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        {slots.map((slot) => {
          const start = new Date(slot.startTime);
          const end = new Date(slot.endTime);
          const isSelected = selectedSlot?.startTime === slot.startTime;

          return (
            <Button
              key={slot.startTime}
              variant={isSelected ? 'filled' : 'outline'}
              onClick={() => onSelectSlot(isSelected ? null : slot)}
              styles={{ inner: { flexDirection: 'column', gap: 2 } }}
            >
              <Text size="sm">{start.toLocaleDateString('ru-RU', { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
              <Text size="xs">{start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} — {end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</Text>
            </Button>
          );
        })}
      </SimpleGrid>
    </Paper>
  );
}
