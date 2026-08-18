import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Grid, Group, Text, Title } from '@mantine/core';
import { api } from '../../lib/api';
import type { components } from '../../lib/api.types';

type EventType = components['schemas']['EventType'];

export function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.GET('/api/event-types').then(({ data }) => {
      if (data) {
        setEventTypes(data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Container><Text>Загрузка...</Text></Container>;
  }

  return (
    <Container size="lg">
      <Title order={2} mb="lg">Типы событий</Title>
      <Grid>
        {eventTypes.map((et) => (
          <Grid.Col key={et.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/event-types/${et.id}`)}
            >
              <Title order={4}>{et.title}</Title>
              {et.description && (
                <Text size="sm" c="dimmed" mt="xs" lineClamp={2}>
                  {et.description}
                </Text>
              )}
              <Group mt="md">
                <Text size="sm" fw={500}>{et.durationMinutes} мин</Text>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
