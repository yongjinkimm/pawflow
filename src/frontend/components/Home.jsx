import React from 'react';
import {
  Box,
  Button,
  Heading,
  Inline,
  ProgressBar,
  Stack,
  Text,
} from '@forge/react';

const Home = ({
  issueKey,
  petCount,
  completedCount,
  totalCount,
  onStartCare,
  onManagePets,
}) => {
  const progress =
    totalCount > 0 ? completedCount / totalCount : 0;

  const percentage = Math.round(progress * 100);

  const status =
    completedCount === 0
      ? '시작 전'
      : percentage === 100
        ? '케어 완료'
        : '진행 중';

  return (
    <Stack space="space.400">
      <Stack space="space.100">
        <Heading size="large">🐾 PawFlow</Heading>

        <Text>
          Jira Issue 기반으로 반려동물 케어 절차를
          표준화하고 진행 상태를 관리합니다.
        </Text>
      </Stack>

      <Box
        padding="space.300"
        backgroundColor="color.background.neutral"
        borderRadius="border.radius.200"
      >
        <Stack space="space.150">
          <Text>현재 Jira 업무</Text>

          <Heading size="medium">
            {issueKey ?? '-'}
          </Heading>

          <Inline space="space.300">
            <Text>등록 반려동물 {petCount}마리</Text>
            <Text>상태 · {status}</Text>
          </Inline>

          <Text>
            현재 선택 업무 진행률 · {percentage}%
          </Text>

          <ProgressBar value={progress} />

          <Text>
            {completedCount} / {totalCount} 완료
          </Text>
        </Stack>
      </Box>

      <Stack space="space.200">
        <Heading size="medium">업무 시작</Heading>

        <Text>
          반려동물을 선택하고 케어 유형별 표준
          체크리스트를 수행합니다.
        </Text>

        <Button
          appearance="primary"
          onClick={onStartCare}
        >
          🐾 케어 업무 시작
        </Button>
      </Stack>

      <Stack space="space.200">
        <Heading size="medium">반려동물 관리</Heading>

        <Text>
          케어 대상의 기본 정보와 보호자 정보를
          등록하거나 수정합니다.
        </Text>

        <Button onClick={onManagePets}>
          반려동물 관리
        </Button>
      </Stack>
    </Stack>
  );
};

export default Home;