# gaimc.kr — 한성대학교 글로벌AI경영컨설팅학과 홈페이지

학과 홍보와 해외 협력을 위한 정적 홈페이지입니다. 내용은 항목별 데이터 파일에 있고, 페이지는 빌드할 때 이 데이터로 만들어집니다.

- 소유: 한성대학교 글로벌AI경영컨설팅학과 / 관리 담당: 박양수 교수(담당자 변경 시 아래 인수인계 항목 전달)
- 기술: [Eleventy](https://www.11ty.dev/) 정적 사이트 + [Sveltia CMS](https://github.com/sveltia/sveltia-cms)(관리자 화면, Decap CMS 호환) + GitHub Pages(자동 배포)
- 구축 지침 원본: Google Drive `홈페이지_글로벌AI경영컨설팅학과/gaimc.kr_구축지침_콘텐츠_v3.md`

## 1. 내용 수정 방법

### 관리자 화면(권장)
1. `https://gaimc.kr/admin/` 접속
2. **Sign In Using Access Token**을 누르고 본인 GitHub 토큰 입력(발급 방법은 `docs/SETUP.md` 5단계). 사람마다 본인 GitHub 계정을 쓰며 공용 비밀번호는 만들지 않습니다
3. 뉴스룸, 활동·행사, 교수진, 페이지 내용·설정에서 수정 후 **저장(Save)**
4. 저장하면 저장소에 커밋되고 1~2분 뒤 사이트에 반영됩니다

### 파일 직접 수정
| 내용 | 파일 |
| --- | --- |
| 배너, 연락처, 학교 링크, 첫 화면 사진 | `src/_data/site.yml` |
| 메인 문구, 한눈에 보는 학과 수치, 바로가기 | `src/_data/home.yml` |
| 인사말, 비전, 학과 특징, 연혁 | `src/_data/about.yml` |
| 전공·과정, 교과목 15개, 진로 | `src/_data/courses.yml` |
| 글로벌 IPP | `src/_data/ipp.yml` |
| 협력기관 | `src/_data/partners.yml` |
| 입학안내 | `src/_data/admission.yml` |
| 특강 연사, 연구원 | `src/_data/people.yml` |
| 교수(1인 1파일) | `src/faculty/people/*.md` |
| 행사(1건 1파일) | `src/events/items/*.md` |
| 뉴스(1건 1파일) | `src/news/items/*.md` |
| 사진 | `src/images/` (관리자 화면 업로드는 `src/images/uploads/`) |

- `memo` 항목은 관리용 메모이며 화면에 나오지 않습니다. 공개 전 확인할 사항은 여기에 적습니다
- 화면에 "[확인]" 같은 표시나 휴대폰 번호·생년월일이 나오면 배포 전 검수에서 자동으로 막힙니다(`scripts/check-site.mjs`)

### 공개 전환 스위치
| 스위치 | 위치 | 현재 | 켜는 시점 |
| --- | --- | --- | --- |
| 상단 원서접수 배너 | 사이트 설정 > 상단 띠 배너 > 표시 | 끔 | 학교 공식 모집요강 공고(10월 중순) 후 일정 대조 |
| 입학안내 세부(일정·자격·전형·서류) | 입학안내 > 세부 안내 공개 | 끔 | 같은 시점 |
| 전형료·등록금·장학금 | 입학안내 > 전형료·등록금·장학금 공개 | 끔 | 2027학년도 금액 확인 후 |
| 연혁의 기수별 입학 인원 | 학과소개 > 연혁에 기수별 입학 인원 표시 | 끔 | 학과 결정 후 |
| 메뉴의 글로벌 IPP | 사이트 설정 > 메뉴에 글로벌 IPP 표시 | 켬 | 학과 협의에 따라 |
| IPP 준비 중 안내 | 글로벌 IPP > 준비 중 표시 | 켬 | IPP 내용 확정 후 끔 |

## 2. 개발자용

```bash
npm install
npm start        # http://localhost:8080 미리보기
npm test         # 빌드 + 검수
```

- 폴더 구조: 지침 0-3과 같으며 메뉴마다 실제 폴더 주소(`/about/`, `/faculty/` …)를 씁니다
- 교수 상세 페이지는 `has_profile: true`인 교수만 `/faculty/<영문이름>/`으로 만들어집니다
- 행사·뉴스 파일 이름의 날짜 앞부분은 주소에서 빠집니다(`2026-08-06-korea-vietnam-seminar.md` → `/events/korea-vietnam-seminar/`)
- 영문(`/en/`)·베트남어(`/vi/`)는 현재 요약 페이지이며 같은 구조로 확장할 예정입니다
- `main` 브랜치에 올라오면 `.github/workflows/deploy.yml`이 빌드·검수 후 GitHub Pages로 배포합니다

## 3. 인수인계

비밀번호는 이 문서나 저장소에 적지 않습니다.

| 항목 | 내용 |
| --- | --- |
| 도메인 | gaimc.kr (가비아, 2026. 10. 1년 등록, 만료일은 가비아 My가비아에서 확인해 기입: ____) |
| 도메인 명의 | 등록 시 개인 명의, 승인 후 학과 명의와 학과 공용 메일로 전환 |
| DNS | 가비아 DNS 관리툴(레코드는 `docs/SETUP.md` 3단계) |
| 코드·콘텐츠 저장소 | GitHub 조직 `gaimc-kr` / 저장소 `gaimc.kr` (조직 소유자: 학과 공용 메일 계정 + 관리 담당자) |
| 호스팅 | GitHub Pages(저장소 Settings > Pages, 무료) |
| 관리자 화면 | `https://gaimc.kr/admin/`, 조직 구성원이 각자 GitHub 토큰으로 로그인 |
| 담당자 변경 시 | 새 담당자를 조직 Owner로 초대 → 기존 담당자 권한 회수 → 가비아 도메인 관리 권한 이전 |
