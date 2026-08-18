import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Group, Text, Title } from '@mantine/core';
import { api } from '../../lib/api';
import type { components } from '../../lib/api.types';
import { SlotPicker } from '../../components/SlotPicker';

type EventType = components['schemas']['EventType'];
type Slot = components['schemas']['Slot'];

export function EventTypeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.GET('/api/event-types/{id}', { params: { path: { id } } }).then(({ data }) => {
      if (data) {
        setEventType(data);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <Container><Text>Загрузка...</Text></Container>;
  }

  if (!eventType) {
    return <Container><Text>Тип события не найден</Text></Container>;
  }

  return (
    <Container size="md">
      <Title order={2}>{eventType.title}</Title>
      <Text c="dimmed" mb="md">{eventType.durationMinutes} мин</Text>
      {eventType.description && (
        <Text mb="lg">{eventType.description}</Text>
      )}

      <SlotPicker
        eventTypeId={id!}
        durationMinutes={eventType.durationMinutes}
        selectedSlot={selectedSlot}
        onSelectSlot={setSelectedSlot}
      />

      {selectedSlot && (
        <Group mt="lg">
          <Button
            size="lg"
            onClick={() => navigate(`/event-types/${id}/book`, { state: { slot: selectedSlot, eventType } })}
          >
            Забронировать
          </Button>
        </Group>
      )}
    </Container>
  );
}
