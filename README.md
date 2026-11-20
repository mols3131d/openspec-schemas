# OpenSpec Schemas

에이전틱 개발 도구인 OpenSpec의 커스텀 스키마(Custom Schemas)를 생성하고 유지보수하는 저장소입니다.

## Goals

- 재사용 가능한 스키마와 Skill 등 배포 가능한 자산의 원본을 [src/](src/README.md)에서 관리

## Directory Structure

```text
openspec-schemas/
├── docs/
├── src/                       # 다른 저장소에도 배포 가능한 자산의 원본
│   ├── schemas/               # OpenSpec 커스텀 스키마
│   │   └── <schema-name>/
│   └── skills/                # 재사용 가능한 Agent Skills
├── AGENTS.md
├── CHATBOT.md
└── README.md
```

`src/`의 배치만으로 외부 저장소에 자동 배포되지는 않습니다. 배포 방식과 대상은 별도로 정의합니다.

## Schemas

| Schema | Description |
| --- | --- |
| [spec-driven-tdd](src/schemas/spec-driven-tdd/README.md) | OpenSpec의 Artifact 의존성을 활용해 변경 의도부터 TDD 호환 구현까지 연결하는 계획 스키마 |

## Development harness

에이전트 지침은 [AGENTS.md](AGENTS.md), 챗 런타임 진입점은 [CHATBOT.md](CHATBOT.md), 도구 설치·검증은 [Development Tooling](docs/tooling.md)을 참고합니다.

```sh
mise install
mise run setup
mise run check
mise run schema-check
```

설치와 최초 Rulesync 동기화는 외부 다운로드·로컬 쓰기를 포함하므로 설정을 검토한 다음 실행합니다. `mise run schema-check`는 임시 OpenSpec 프로젝트에서 스키마를 검증한다. 실제 외부 저장소 배포와 Skill 로딩은 별도로 확인해야 한다.

## Consumer E2E

`mise run e2e-check`는 격리된 임시 프로젝트에서 OpenSpec 초기화, Change의 Artifact 생성·검증·archive와 재초기화를 검증한다. LLM은 호출하지 않는다.

`mise run e2e-init`는 `.tmp/openspec-consumer/`에 간단한 Counter 프로젝트와 이 저장소의 스키마를 설치한다. 같은 명령을 다시 실행하면 **해당 디렉터리의 기존 작업 내용이 삭제되고 초기 상태로 돌아간다.** 이 예제에서 코딩 에이전트의 실제 작업을 별도로 시험할 수 있다.
