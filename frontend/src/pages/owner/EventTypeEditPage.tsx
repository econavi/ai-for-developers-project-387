import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Group, TextInput, NumberInput, Textarea, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '../../lib/api';

export function EventTypeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const isNew = !id;

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      description: '',
      durationMinutes: 30,
    },
    validate: {
      title: (v: string) => (v.trim().length === 0 ? 'Название обязательно' : null),
      durationMinutes: (v: number) => (v < 1 ? 'Минимальная длительность — 1 минута' : null),
    },
  });

  useEffect(() => {
    if (!id) return;
    api.GET('/api/event-types/{id}', { params: { path: { id } } }).then(({ data }) => {
      if (data) {
        form.setValues({
          title: data.title,
          description: data.description || '',
          durationMinutes: data.durationMinutes,
        });
      }
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (values: { title: string; description: string; durationMinutes: number }) => {
    if (isNew) {
      const { error } = await api.POST('/api/event-types', {
        body: {
          title: values.title,
          description: values.description || undefined,
          durationMinutes: values.durationMinutes,
        },
      });
      if (error) {
        notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось создать тип события' });
        return;
      }
      notifications.show({ color: 'green', title: 'Создано', message: 'Тип события создан' });
    } else {
      const { error } = await api.PUT('/api/event-types/{id}', {
        params: { path: { id: id! } },
        body: {
          title: values.title,
          description: values.description || undefined,
          durationMinutes: values.durationMinutes,
        },
      });
      if (error) {
        notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось обновить тип события' });
        return;
      }
      notifications.show({ color: 'green', title: 'Обновлено', message: 'Тип события обновлён' });
    }
    navigate('/owner/event-types');
  };

  if (loading) {
    return <Container><Text>Загрузка...</Text></Container>;
  }

  return (
    <Container size="sm">
      <Title order={2} mb="lg">{isNew ? 'Создать тип события' : 'Редактировать тип события'}</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Название"
          placeholder="Консультация"
          required
          key={form.key('title')}
          {...form.getInputProps('title')}
        />
        <Textarea
          label="Описание"
          placeholder="Описание типа события"
          mt="sm"
          key={form.key('description')}
          {...form.getInputProps('description')}
        />
        <NumberInput
          label="Длительность (минуты)"
          placeholder="30"
          required
          min={1}
          mt="sm"
          key={form.key('durationMinutes')}
          {...form.getInputProps('durationMinutes')}
        />
        <Group mt="lg">
          <Button type="submit">{isNew ? 'Создать' : 'Сохранить'}</Button>
          <Button variant="outline" onClick={() => navigate('/owner/event-types')}>Отмена</Button>
        </Group>
      </form>
    </Container>
  );
}
