# gaimc.kr 연결 절차(사용자 작업)

코드는 준비되어 있습니다. 아래 순서대로 진행하면 `https://gaimc.kr`이 열립니다. 비밀번호와 토큰은 어디에도 적거나 공유하지 마십시오.

| 단계 | 할 일 | 소요 |
| --- | --- | --- |
| 1 | GitHub 계정에 학교 이메일 연동 | 5분 |
| 2 | 학과 GitHub 조직·저장소 만들기 | 10분 |
| 3 | 가비아 DNS 레코드 입력 | 10분(반영 최대 24시간) |
| 4 | GitHub Pages에 도메인 연결, HTTPS 켜기 | 10분 |
| 5 | 관리자 화면 로그인 토큰 만들기 | 5분 |

---

## 1. GitHub 계정에 학교 이메일(@hansung.ac.kr) 연동

1. github.com 로그인 → 오른쪽 위 프로필 사진 → **Settings**
2. 왼쪽 메뉴 **Access** 묶음의 **Emails**
3. **Add email address**에 `parkys@hansung.ac.kr` 입력 → **Add**
4. 학교 메일함에 온 GitHub 인증 메일의 **Verify email address** 클릭(메일이 안 오면 스팸함 확인, Emails 화면에서 **Resend verification email**)
5. (선택) 같은 화면 **Primary email address**를 학교 메일로 바꾸면 GitHub 알림이 학교 메일로 옵니다
6. (선택) **Keep my email addresses private**를 켜 두면 커밋 기록에 메일 주소가 드러나지 않습니다

> 학교 메일을 등록해 두면 [GitHub Education](https://education.github.com/benefits)의 교원(Teacher) 혜택을 신청할 때도 그대로 씁니다. 홈페이지 운영에는 필수가 아닙니다.

## 2. 학과 GitHub 조직과 저장소

조직(Organization)은 학과 소유의 공간입니다. 담당자가 바뀌어도 조직째로 넘길 수 있습니다.

1. https://github.com/organizations/plan → **Free** 선택
2. Organization name: `gaimc-kr` (다른 이름을 쓰면 알려 주십시오. 설정 파일 한 줄을 바꿉니다)
3. Contact email: 학과 공용 메일(아직 없으면 학교 메일로 두고 나중에 변경)
4. **This organization belongs to: A business or institution** → Name of business or institution에 `Hansung University`
5. 조직이 만들어지면 **New repository**
   - Repository name: `gaimc.kr`
   - **Public** 선택(무료 GitHub Pages는 공개 저장소에서만 작동. 저장소에는 공개용 내용만 있고 비밀번호·개인 연락처는 넣지 않았습니다)
   - README 등 초기 파일은 만들지 않음(빈 저장소)
6. Claude가 이 저장소에 코드를 올릴 수 있도록 Claude GitHub 앱을 조직에 설치: https://github.com/apps/claude/installations/select_target → `gaimc-kr` 선택 → **Only select repositories** → `gaimc.kr`
7. 여기까지 끝나면 Claude에게 "조직 만들었다"고 알려 주십시오. 코드를 새 저장소로 옮기고 배포를 켭니다

## 3. 가비아 DNS 설정

1. 가비아(gabia.com) 로그인 → **My가비아** → **도메인** → `gaimc.kr` 오른쪽 **관리** → **DNS 정보** 영역의 **도메인 연결** 또는 **DNS 관리툴**
2. 네임서버가 가비아 기본(`ns.gabia.co.kr` 등)인지 확인
3. **DNS 설정 → 레코드 수정**에서 아래 레코드 추가(기존 `@` A 레코드나 가비아 기본 주차 레코드가 있으면 삭제)

| 타입 | 호스트 | 값/위치 | TTL |
| --- | --- | --- | --- |
| A | @ | 185.199.108.153 | 3600 |
| A | @ | 185.199.109.153 | 3600 |
| A | @ | 185.199.110.153 | 3600 |
| A | @ | 185.199.111.153 | 3600 |
| AAAA | @ | 2606:50c0:8000::153 | 3600 |
| AAAA | @ | 2606:50c0:8001::153 | 3600 |
| AAAA | @ | 2606:50c0:8002::153 | 3600 |
| AAAA | @ | 2606:50c0:8003::153 | 3600 |
| CNAME | www | gaimc-kr.github.io. | 3600 |
| TXT | _github-pages-challenge-gaimc-kr | (4-1단계에서 GitHub가 알려 주는 값) | 3600 |

4. **저장**. 반영에는 보통 10분~1시간, 길면 24시간 걸립니다

> 가비아 화면에서 CNAME 값 끝의 마침표(.)를 받지 않으면 빼고 입력합니다. AAAA(IPv6) 입력 칸이 없으면 A 레코드 4개만으로도 접속됩니다.

## 4. GitHub Pages에 도메인 연결

### 4-1. 도메인 소유 확인(조직 단위, 다른 사람이 도메인을 가로채지 못하게 함)
1. 조직 페이지 → **Settings** → 왼쪽 **Pages** → **Add a domain** → `gaimc.kr`
2. 화면에 나온 TXT 레코드의 호스트(`_github-pages-challenge-gaimc-kr`)와 값을 3단계 표의 TXT 줄에 입력
3. 몇 분 뒤 **Verify**

### 4-2. 저장소에 도메인 연결
1. 저장소 `gaimc.kr` → **Settings** → **Pages**
2. **Build and deployment → Source: GitHub Actions** (Claude가 코드를 올린 뒤 첫 배포가 끝나야 다음 항목이 보입니다)
3. **Custom domain**에 `gaimc.kr` 입력 → **Save** → DNS 확인이 끝나면 초록색 체크
4. **Enforce HTTPS** 체크(인증서 발급에 최대 1시간 정도 걸릴 수 있음)

## 5. 관리자 화면(/admin) 로그인

### 5-1. 기본 방법: GitHub 아이디·비밀번호 (2026. 10. 5. 설정 완료)
1. `https://gaimc.kr/admin/` → **GitHub(으)로 로그인**
2. GitHub 아이디·비밀번호 입력(처음 한 번은 **Authorize** 승인, gaimc-kr 옆 **Grant**가 보이면 함께 누름)

구성(변경 시 참고)
- GitHub OAuth 앱: gaimc-kr 조직 Settings → OAuth Apps → "gaimc.kr 관리자 화면"
  - Redirect URI: `https://sveltia-cms-auth.parkys.workers.dev/callback`
- 로그인 중계 서버: Cloudflare(학교 계정 parkys@hansung.ac.kr) → Workers 및 Pages → `sveltia-cms-auth`
  - 설정 → 런타임 변수: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`(비밀), `ALLOWED_DOMAINS`=`gaimc.kr`
  - 코드 저장소: gaimc-kr/sveltia-cms-auth(비공개)
- 사이트 쪽 연결: 관리자 화면 > 사이트 설정 > 관리자 화면 연결 > GitHub 로그인 중계 서버 주소
- `incorrect_client_credentials` 오류가 나면: GitHub에서 Client Secret을 새로 만들어(복사 아이콘 사용, 공백 주의) Cloudflare 값 교체 후 배포

### 5-2. 다른 직원에게 권한 주기(믿을 수 있는 소수만)
1. 그분이 github.com에서 무료 계정 생성
2. github.com/orgs/gaimc-kr/people → **Invite member** → 역할 Member
3. 저장소 gaimc.kr → **Settings → Collaborators and teams** → 그분에게 **Write**
4. 그분이 5-1 방법으로 로그인. 권한을 거둘 때는 2·3에서 제거
5. **접속 통계·검색 관리 권한과 주간 통계 메일도 함께 추가** → 8장 체크리스트를 빠짐없이 진행
- 로그인한 사람은 사이트 전체를 수정할 수 있으며(게시판만 따로 권한 분리 불가), 모든 수정은 GitHub에 기록되어 되돌릴 수 있습니다.

### 5-3. 예비 방법: 액세스 토큰
중계 서버에 문제가 있을 때 **액세스 토큰으로 로그인**을 사용합니다.
1. GitHub **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
2. Resource owner: gaimc-kr, Repository access: Only select → `gaimc.kr`, Permissions: Contents **Read and write**
3. 생성된 토큰을 `https://gaimc.kr/admin/`의 **액세스 토큰으로 로그인**에 붙여넣기

## 6. 이후 할 일

- 학과 공용 메일이 생기면: GitHub 조직 Owner로 초대, 가비아 도메인 명의·연락처 이전, README 인수인계 표 갱신
- 학교 공식 모집요강 공고(10월 중순) 후: 입학안내 수치 대조 → 관리자 화면에서 배너·입학 세부 공개 스위치 켜기
- 첫 화면 사진 교체: 관리자 화면 > 페이지 내용·설정 > 사이트 설정 > 첫 화면 사진(현재 한성대 통합브랜딩 PPT 템플릿의 캠퍼스 전경)
- 관리자(담당자)를 추가·교체할 때: 8장 체크리스트

### 6-1. 확인 대기 목록(자료 받으면 반영, 2026. 10. 7. 기준)
- [ ] 특강연사 추가 프로필(10. 8. 마감) → 받는 대로 국·영·베 반영, 직위 "강의초청교수"로 적혀 있으면 특강연사로
- [ ] 김현식(특강연사 예정): 본인 게재 동의와 프로필 양식을 받은 뒤 반영. 드라이브의 영남대 제출용 이력서는 다른 목적으로 받은 자료라 사용하지 않음
- [ ] 권연재: 박사 학위 여부 확인 후 학력 수정
- [ ] 임성욱·송선정·정효근: 원본(고해상도) 사진 받으면 교체(현재 복원·확대본)
- [ ] 최천근: 「경호경비적 관점에서 자치경찰제 도입에 관한 시론적 고찰」 학술지명(프로필 "시큐리티연구 14(3)" ↔ 기록 "한국경호경비학회지 67호")
- [ ] 송선정: 2024 논문 제목("생성형 AI **서비스의** 구독의도…" 여부)
- [ ] 교수진 논문 DOI·URL 추가 제공분 검증 후 연결(미연결 123건)
- [ ] 10월 중순 2027 전기 모집요강 공고 → 입학안내 대조, 배너·세부 공개 스위치
- [ ] 글로벌융합대학원 승인 시 소속 표기 되돌리기(site.yml, admission.yml, about.yml 문장·연혁, 국·영·베)
- [x] 글로벌 IPP 내용 보강(2026. 10. 8. 보고서 기준 공개 범위 반영), 국내외 협력기관 추가(2026. 10. 8.)
- [ ] 글로벌 IPP: 산업AI EXPO(10. 21.~23.) 종료 후 결과 반영, 실행단계 결과 보고(2027. 2.) 후 성과 갱신
- [ ] 자료실 메뉴 신설 검토

### 6-2. 최소 보안 설정(한 번만)
1. GitHub 2단계 인증: github.com → Settings → Password and authentication(관리자 모두)
2. Google 계정 2단계 인증(애널리틱스·서치콘솔·데이터 스튜디오 관리 계정)
3. 가비아 도메인 **자동 연장** 설정(만료되면 사이트가 사라짐)

## 7. 검색엔진 등록과 접속 통계 (2026. 10. 7. 설정 완료)

사이트에는 검색 노출용 설정(robots.txt, 전체 페이지 사이트맵 `https://gaimc.kr/sitemap.xml`, 언어별 연결 정보)이 들어 있습니다.

### 7-0. 현재 설정 기록

| 항목 | 관리 계정 | 확인 방식·값 | 상태 |
|---|---|---|---|
| Google Search Console | 박양수 교수 Google 계정 | URL 접두어 `https://gaimc.kr/` 속성. HTML 파일 방식(`src/google67cc7790e635c46d.html`) | 소유확인 완료. 사이트맵 제출·첫 화면 색인 요청 |
| 네이버 서치어드바이저 | 박양수 교수 네이버 계정 | HTML 태그 방식. `site.yml`의 `analytics.naver_verification` | 소유확인·사이트맵 제출·첫 화면 수집 요청 완료 |
| Google 애널리틱스(GA4) | 박양수 교수 Google 계정 | 계정 "한성대 GAIMC", 웹 스트림 `gaimc`(스트림 ID 16057934730), 측정 ID `G-BYYLVH7XNJ`. `site.yml`의 `analytics.ga4_id` | 모든 페이지 연결 완료 |

- 위 값들은 원래 공개되는 값이라 저장소에 있어도 됩니다. 비밀번호·시크릿과는 다릅니다.
- 확인 파일(`src/google67cc7790e635c46d.html`)과 네이버 태그를 지우면 소유확인이 풀리므로 삭제하지 마십시오.
- 관리 계정을 바꾸거나 다른 사람에게 넘길 때는 기존 계정으로 로그인해 새 사람을 추가한 뒤 넘깁니다(아래 7-4).

### 7-1. Google Search Console(구글 검색 등록) — 처음 설정 절차(참고용)
1. https://search.google.com/search-console 에 학과 관리용 Google 계정으로 로그인 → **속성 추가**
2. **도메인** 방식에 `gaimc.kr` 입력 → 화면에 나온 TXT 값을 가비아 DNS에 추가(호스트 `@`, 타입 TXT) → **확인**
   - DNS가 번거로우면 **URL 접두어** 방식(`https://gaimc.kr`) → **HTML 태그** 선택 → `content="..."` 안의 값만 관리자 화면 > 사이트 설정 > 검색엔진 등록·접속 통계 > Google Search Console 확인 코드에 입력·저장 → 1~2분 뒤 **확인**
3. 왼쪽 **Sitemaps** → `sitemap.xml` 입력 → 제출
4. **URL 검사**에 `https://gaimc.kr/` 입력 → **색인 생성 요청**(첫 노출까지 보통 며칠~2주)

### 7-2. 네이버 서치어드바이저(네이버 검색 등록)
1. https://searchadvisor.naver.com → 웹마스터 도구 → 사이트 등록 `https://gaimc.kr`
2. **HTML 태그** 방식 → content 값을 관리자 화면 > 네이버 서치어드바이저 확인 코드에 입력 → 확인
3. 요청 > 사이트맵 제출 `https://gaimc.kr/sitemap.xml`

### 7-3. Google 애널리틱스(접속 통계)
1. https://analytics.google.com → 계정·속성 만들기(웹 스트림 `https://gaimc.kr`)
2. 측정 ID(`G-`로 시작)를 관리자 화면 > Google 애널리틱스 측정 ID에 입력·저장 → 모든 페이지에 자동 적용
3. 통계는 analytics.google.com(방문자·페이지별 조회·국가·유입 경로), 검색어·노출은 Search Console에서 확인. 다른 직원에게는 각 서비스의 **사용자 관리**에서 Google 계정으로 보기 권한 부여

### 7-4. 접속 통계 보는 방법과 권한 주기
- **보는 곳**: https://analytics.google.com 에 관리 계정으로 로그인 → 왼쪽 **보고서**
  - **실시간**: 지금(최근 30분) 접속자, 보고 있는 페이지
  - **수명 주기 → 획득**: 어디서 들어왔는지(구글·네이버 검색, 직접 입력, SNS 등)
  - **수명 주기 → 참여 → 페이지 및 화면**: 페이지별 조회수(국문 `/`, 영문 `/en/`, 베트남어 `/vi/` 구분)
  - **사용자 → 사용자 속성 → 인구통계 세부정보**: 국가·도시별 방문자
- **휴대폰**: "Google Analytics" 앱 설치 후 같은 계정으로 로그인
- **이메일로 받기**: Looker Studio(https://lookerstudio.google.com)에서 GA4 데이터로 보고서를 만든 뒤 **공유 → 이메일 전송 예약**으로 주 1회·월 1회 자동 발송 설정
- **검색어·검색 노출 수**: 애널리틱스가 아니라 Search Console **실적**, 네이버 서치어드바이저 **리포트**에서 확인
- **다른 직원에게 보기 권한**: 애널리틱스 **관리(톱니바퀴) → 속성 액세스 관리 → +** → 직원 Google 계정 입력, 역할 **뷰어**. Search Console은 **설정 → 사용자 및 권한**에서 추가. 네이버는 직원이 자기 아이디로 `https://gaimc.kr`을 등록하면 새 확인 값이 나오므로, 그 값을 사이트에 추가해야 함(현재 사이트 설정에는 확인 값이 하나만 들어감 — 필요하면 개발 담당에게 요청)
- 홈페이지 관리자 화면(/admin)에는 통계가 표시되지 않습니다(콘텐츠 수정 전용).

### 7-5. 관리자 화면에서 통계 보기(Looker Studio 보고서 연결)
관리자 화면(/admin) 오른쪽 아래 **접속 통계** 버튼 → `/admin/stats/` 화면에 Looker Studio 보고서가 표시됩니다. 보고서는 권한을 준 Google 계정으로 로그인한 사람에게만 보입니다.

1. https://lookerstudio.google.com 에 애널리틱스 관리 계정으로 로그인 → **만들기 → 보고서**
2. 데이터 추가: **Google 애널리틱스** → 계정 "한성대 GAIMC" → 속성 "gaimc.kr" → **추가**
3. 보고서 이름을 "gaimc.kr 접속 통계"로 바꾸고 아래 구성을 추가(**차트 추가** 메뉴)
   - 기간 컨트롤(기본값: 지난 28일)
   - 스코어카드 3개: 활성 사용자, 세션, 조회수
   - 시계열: 측정기준 날짜, 측정항목 활성 사용자
   - 표: 페이지 경로 및 화면 클래스 + 조회수(인기 페이지, `/en/`·`/vi/`로 언어 구분)
   - 표 또는 지도: 국가 + 활성 사용자
   - 표: 세션 소스/매체 + 세션(구글·네이버 검색, 직접 방문 등)
4. **파일 → 보고서 퍼가기** → "퍼가기 사용" 체크 → **URL 퍼가기** 복사
5. 관리자 화면 > 페이지 내용·설정 > 사이트 설정 > 검색엔진 등록·접속 통계 > **통계 보고서 퍼가기 주소**에 붙여 넣고 저장
6. 직원에게 보여주려면 보고서 오른쪽 위 **공유**에서 직원 Google 계정을 뷰어로 추가
7. 이메일로도 받으려면 **공유 ▾ → 이메일 전송 예약** → 받는 사람, 반복(예: 매주 월요일 오전) 지정 → 저장

### 7-6. 주간 통계 메일 (2026. 10. 7. 설정)
- Looker Studio 보고서 "gaimc.kr 접속 통계" → **공유 ▾ → 이메일 전송 예약**
- 현재: 받는 사람 박양수 교수(개인 계정, parkys@hansung.ac.kr), 전체 5개 페이지, **매주 목요일 오전 9시**(2026. 10. 8. 시작)
- 받는 사람 추가·변경: 같은 메뉴에서 **수신자 더 추가**에 이메일 입력 → 저장

## 8. 관리자(담당자) 추가·교체 체크리스트

새 담당자가 생기면 아래를 **모두** 진행합니다. 권한을 거둘 때는 같은 곳에서 제거합니다. 1~3은 홈페이지 수정 권한, 4~8은 통계·검색 관리 권한입니다.

| 순서 | 할 일 | 어디서 |
|---|---|---|
| 1 | GitHub 계정 만들기(학교 이메일 연동 권장, 1장) | 본인 |
| 2 | 조직 초대(역할 Member) | github.com/orgs/gaimc-kr/people → Invite member |
| 3 | 저장소 쓰기 권한(Write) | 저장소 gaimc.kr → Settings → Collaborators and teams |
| 4 | 통계 보고서 보기 권한(관리자 화면 [접속 통계 보기]에 보고서가 보이려면 필수) | Looker Studio "gaimc.kr 접속 통계" → 공유 → 이메일 입력, 뷰어 |
| 5 | **주간 통계 메일 받는 사람에 추가** | 같은 보고서 → 공유 ▾ → 이메일 전송 예약 → 수신자 더 추가 → 저장 |
| 6 | 애널리틱스 보기 권한 | analytics.google.com → 관리(톱니바퀴) → 속성 액세스 관리 → + → 뷰어 |
| 7 | 구글 검색 실적 보기 권한(선택) | Search Console(gaimc.kr) → 설정 → 사용자 및 권한 → 사용자 추가 |
| 8 | 네이버 검색 관리(선택) | 새 담당자가 자기 네이버 아이디로 서치어드바이저에 gaimc.kr 등록 → 나오는 확인 값을 사이트에 추가(개발 담당에게 요청) |
| 9 | README 인수인계 표에 이름·역할 기록 | 저장소 README.md |

- 4~7에 넣는 이메일은 **Google 계정**이어야 합니다(Gmail 또는 Google 계정으로 등록된 학교 메일).
- 담당자가 바뀌어 전임자가 빠질 때는 2·3·4·5·6·7에서 전임자를 제거하고, 보고서·애널리틱스의 **소유자**가 전임자라면 먼저 새 담당자에게 소유권(관리자 권한)을 넘긴 뒤 제거합니다.
