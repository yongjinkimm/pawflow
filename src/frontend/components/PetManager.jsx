import React from 'react';
import {
  Box,
  Button,
  Heading,
  Inline,
  Label,
  Select,
  Stack,
  Text,
  TextArea,
  Textfield,
} from '@forge/react';

const PetManager = ({
  pets,
  petForm,
  editingPet,
  speciesOptions,
  getSpeciesLabel,
  onPetFormChange,
  onCreatePet,
  onStartEdit,
  onEditChange,
  onUpdatePet,
  onCancelEdit,
  onBack,
  message,
}) => {
  return (
    <Stack space="space.400">
      <Button appearance="subtle" onClick={onBack}>
        ← 홈으로
      </Button>

      <Stack space="space.100">
        <Heading size="large">
          🐾 반려동물 관리
        </Heading>

        <Text>
          케어 업무에서 사용할 반려동물과 보호자
          정보를 관리합니다.
        </Text>
      </Stack>

      <Heading size="medium">
        등록된 반려동물 · {pets.length}마리
      </Heading>

      {pets.length === 0 ? (
        <Box
          padding="space.300"
          backgroundColor="color.background.neutral"
          borderRadius="border.radius.200"
        >
          <Text>
            아직 등록된 반려동물이 없습니다.
            아래에서 첫 반려동물을 등록해주세요.
          </Text>
        </Box>
      ) : (
        <Stack space="space.200">
          {pets.map((pet) => (
            <Box
              key={pet.id}
              padding="space.300"
              backgroundColor="color.background.neutral"
              borderRadius="border.radius.200"
            >
              <Stack space="space.100">
                <Inline
                  spread="space-between"
                  alignBlock="center"
                >
                  <Heading size="small">
                    {pet.name}
                  </Heading>

                  <Text>
                    {getSpeciesLabel(pet.species)}
                  </Text>
                </Inline>

                <Text>
                  보호자 · {pet.ownerName || '미등록'}
                </Text>

                <Text>
                  연락처 · {pet.ownerPhone || '미등록'}
                </Text>

                <Text>
                  특이사항 · {pet.notes || '없음'}
                </Text>

                <Button
                  appearance="subtle"
                  onClick={() => onStartEdit(pet)}
                >
                  정보 수정
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      {editingPet && (
        <Box
          padding="space.300"
          backgroundColor="color.background.neutral"
          borderRadius="border.radius.200"
        >
          <Stack space="space.200">
            <Heading size="medium">
              {editingPet.name} 정보 수정
            </Heading>

            <Label labelFor="edit-species">
              종류 *
            </Label>

            <Select
              inputId="edit-species"
              options={speciesOptions}
              value={speciesOptions.find(
                (option) =>
                  option.value === editingPet.species
              )}
              onChange={(option) =>
                onEditChange('species', option.value)
              }
            />

            <Label labelFor="edit-name">
              이름 *
            </Label>

            <Textfield
              id="edit-name"
              defaultValue={editingPet.name}
              onBlur={(event) =>
                onEditChange('name', event.target.value)
              }
            />

            <Label labelFor="edit-owner">
              보호자명
            </Label>

            <Textfield
              id="edit-owner"
              defaultValue={editingPet.ownerName}
              onBlur={(event) =>
                onEditChange(
                  'ownerName',
                  event.target.value
                )
              }
            />

            <Label labelFor="edit-phone">
              연락처
            </Label>

            <Textfield
              id="edit-phone"
              defaultValue={editingPet.ownerPhone}
              onBlur={(event) =>
                onEditChange(
                  'ownerPhone',
                  event.target.value
                )
              }
            />

            <Label labelFor="edit-notes">
              특이사항
            </Label>

            <TextArea
              id="edit-notes"
              defaultValue={editingPet.notes}
              onBlur={(event) =>
                onEditChange('notes', event.target.value)
              }
            />

            <Inline space="space.100">
              <Button
                appearance="primary"
                onClick={onUpdatePet}
              >
                수정 저장
              </Button>

              <Button onClick={onCancelEdit}>
                취소
              </Button>
            </Inline>
          </Stack>
        </Box>
      )}

      <Stack space="space.200">
        <Heading size="medium">
          새 반려동물 등록
        </Heading>

        <Text>
          케어 업무에 사용할 기본 정보를 입력해주세요.
        </Text>

        <Label labelFor="pet-species">
          종류 *
        </Label>

        <Select
          inputId="pet-species"
          options={speciesOptions}
          value={speciesOptions.find(
            (option) =>
              option.value === petForm.species
          )}
          onChange={(option) =>
            onPetFormChange('species', option.value)
          }
        />

        <Label labelFor="pet-name">
          이름 *
        </Label>

        <Textfield
          id="pet-name"
          placeholder="예: 멍멍"
          defaultValue={petForm.name}
          onBlur={(event) =>
            onPetFormChange('name', event.target.value)
          }
        />

        <Label labelFor="owner-name">
          보호자명
        </Label>

        <Textfield
          id="owner-name"
          placeholder="예: 홍길동"
          defaultValue={petForm.ownerName}
          onBlur={(event) =>
            onPetFormChange(
              'ownerName',
              event.target.value
            )
          }
        />

        <Label labelFor="owner-phone">
          연락처
        </Label>

        <Textfield
          id="owner-phone"
          placeholder="예: 010-1234-5678"
          defaultValue={petForm.ownerPhone}
          onBlur={(event) =>
            onPetFormChange(
              'ownerPhone',
              event.target.value
            )
          }
        />

        <Label labelFor="pet-notes">
          특이사항
        </Label>

        <TextArea
          id="pet-notes"
          placeholder="예: 알레르기 있음, 복용 중인 약 있음"
          defaultValue={petForm.notes}
          onBlur={(event) =>
            onPetFormChange(
              'notes',
              event.target.value
            )
          }
        />

        <Button
          appearance="primary"
          onClick={onCreatePet}
        >
          반려동물 등록
        </Button>
      </Stack>

      {message && <Text>{message}</Text>}
    </Stack>
  );
};

export default PetManager;