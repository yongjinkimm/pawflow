import React, { useEffect, useState } from 'react';
import ForgeReconciler, {
  Heading,
  Inline,
  Lozenge,
  ProgressBar,
  SectionMessage,
  Spinner,
  Stack,
  Text,
} from '@forge/react';
import { invoke } from '@forge/bridge';

const CARE_TYPE_LABELS = {
  health: '건강검진',
  vaccine: '예방접종',
  grooming: '미용',
};

const getCareTypeLabel = (careType) =>
  CARE_TYPE_LABELS[careType] ?? careType ?? '-';

const getStatusLabel = (status) => {
  switch (status) {
    case 'COMPLETED':
      return '케어 완료';

    case 'IN_PROGRESS':
      return '진행 중';

    default:
      return '시작 전';
  }
};

const getStatusAppearance = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'success';

    case 'IN_PROGRESS':
      return 'inprogress';

    default:
      return 'default';
  }
};

const App = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError('');

        const data = await invoke('getDashboard');

        setDashboard(data);
      } catch (err) {
        console.error(
          'Dashboard 조회 실패:',
          err
        );

        setError(
          '대시보드 정보를 불러오지 못했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <Stack space="space.200">
        <Spinner />
        <Text>
          PawFlow 데이터를 불러오는 중...
        </Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack space="space.300">
        <Heading size="large">
          🐾 PawFlow
        </Heading>

        <SectionMessage
          appearance="error"
          title="데이터 조회 실패"
        >
          <Text>{error}</Text>
        </SectionMessage>
      </Stack>
    );
  }

  const {
    petCount = 0,
    activeCareTasks = 0,
    completedCareTasks = 0,
    totalCareTasks = 0,
    careTasks = [],
  } = dashboard ?? {};

  // 최근 저장된 업무 최대 5개
  const recentTasks = careTasks.slice(0, 5);

  return (
    <Stack space="space.400">

      {/* HEADER */}
      <Stack space="space.100">
        <Heading size="xlarge">
          🐾 PawFlow
        </Heading>

        <Text>
          Jira 기반 반려동물 케어 업무 관리
        </Text>

        <Text>
          반려동물 정보와 Jira Issue 기반
          케어 업무 현황을 한 곳에서 확인합니다.
        </Text>
      </Stack>


      {/* SUMMARY */}
      <Stack space="space.200">
        <Heading size="large">
          업무 현황
        </Heading>

        <Inline space="space.400">
          <Stack space="space.050">
            <Text>
              등록 반려동물
            </Text>

            <Heading size="large">
              {petCount}마리
            </Heading>
          </Stack>

          <Stack space="space.050">
            <Text>
              전체 케어
            </Text>

            <Heading size="large">
              {totalCareTasks}건
            </Heading>
          </Stack>

          <Stack space="space.050">
            <Text>
              진행 중
            </Text>

            <Heading size="large">
              {activeCareTasks}건
            </Heading>
          </Stack>

          <Stack space="space.050">
            <Text>
              완료
            </Text>

            <Heading size="large">
              {completedCareTasks}건
            </Heading>
          </Stack>
        </Inline>
      </Stack>


      {/* RECENT CARE */}
      <Stack space="space.200">
        <Heading size="large">
          최근 케어 업무
        </Heading>

        {recentTasks.length === 0 ? (
          <SectionMessage>
            <Text>
              아직 저장된 케어 업무가 없습니다.
            </Text>

            <Text>
              Jira Issue에서 케어 체크리스트를
              저장하면 이곳에 표시됩니다.
            </Text>
          </SectionMessage>
        ) : (
          <Stack space="space.200">
            {recentTasks.map((task) => {
              const percentage =
                Math.round(
                  (task.progress ?? 0) * 100
                );

              return (
                <SectionMessage
                  key={`${task.issueKey}-${task.petId}-${task.careType}`}
                >
                  <Stack space="space.150">

                    <Inline space="space.100">
                      <Heading size="medium">
                        {task.pet?.name ??
                          '알 수 없는 반려동물'}
                        {' · '}
                        {getCareTypeLabel(
                          task.careType
                        )}
                      </Heading>

                      <Lozenge
                        appearance={getStatusAppearance(
                          task.status
                        )}
                      >
                        {getStatusLabel(
                          task.status
                        )}
                      </Lozenge>
                    </Inline>

                    <Text>
                      Jira Issue · {task.issueKey}
                    </Text>

                    <Text>
                      진행률 · {percentage}% (
                      {task.completedCount} /{' '}
                      {task.totalCount})
                    </Text>

                    <ProgressBar
                      value={task.progress ?? 0}
                    />

                    {task.updatedAt && (
                      <Text>
                        마지막 저장 ·{' '}
                        {new Date(
                          task.updatedAt
                        ).toLocaleString(
                          'ko-KR'
                        )}
                      </Text>
                    )}

                  </Stack>
                </SectionMessage>
              );
            })}
          </Stack>
        )}
      </Stack>


      {/* GUIDE */}
      <Stack space="space.200">
        <Heading size="large">
          케어 업무 시작
        </Heading>

        <Text>
          실제 케어 체크리스트는 Jira Issue에서
          PawFlow 패널을 열어 수행합니다.
        </Text>

        <Text>
          반려동물과 케어 유형을 선택하고
          체크리스트를 저장하면 대시보드에
          업무 현황이 반영됩니다.
        </Text>
      </Stack>

    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);