# Distributable Sources

`src/`는 이 저장소에서 작성·유지보수하며 다른 저장소에 배포할 수 있는 **재사용 자산의 정본**을 관리한다.

- [schemas/](schemas/) — OpenSpec 스키마와 그 템플릿·유지보수 문서
- [skills/](skills/) — 이 저장소에서 작성하는 재사용 Agent Skills (현재 없음)

저장소 공통 지침, 개발 도구, 새 스키마 작성을 위한 scaffold는 `src/` 밖에서 관리한다. 외부에서 가져온 Skills, 런타임별 생성 projection, 임시 작업 기록은 이 디렉터리의 정본이 아니다.

`src/`에 배치하는 것만으로 다른 저장소에 자동 설치되거나 배포되지는 않는다. 배포 대상과 절차는 별도로 정의한다.
