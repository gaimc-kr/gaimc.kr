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

## 5. 관리자 화면(/admin) 로그인 토큰

사람마다 본인 GitHub 계정으로 만듭니다. 공용 계정·공용 비밀번호는 만들지 않습니다.

1. GitHub **Settings** → 맨 아래 **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
2. Token name: `gaimc.kr 관리자 화면`, Expiration: 1년 이내
3. **Resource owner: gaimc-kr**, Repository access: **Only select repositories** → `gaimc.kr`
4. **Permissions → Repository permissions → Contents: Read and write** (Metadata: Read-only는 자동 선택)
5. **Generate token** → 나온 토큰을 복사
6. `https://gaimc.kr/admin/` → **Sign In Using Access Token** → 붙여넣기
   - 토큰은 그 브라우저에만 저장됩니다. 공용 PC에서는 사용 후 로그아웃하십시오
   - Resource owner 목록에 `gaimc-kr`가 없거나 승인 대기로 나오면, 조직 **Settings → Personal access tokens**에서 fine-grained 토큰을 허용하거나 요청을 승인합니다
7. 다른 교직원에게 권한을 줄 때: 조직 **People → Invite member**로 초대(역할 Member) → 저장소 `gaimc.kr` **Settings → Collaborators and teams**에서 Write 권한 → 그분이 1~6을 직접 진행

> 매번 토큰 대신 "Sign In with GitHub" 버튼으로 로그인하려면 GitHub OAuth 앱과 무료 인증 중계 서버(Cloudflare Workers의 sveltia-cms-auth)를 추가로 설정합니다. 운영이 안정된 뒤 필요하면 진행합니다.

## 6. 이후 할 일

- 학과 공용 메일이 생기면: GitHub 조직 Owner로 초대, 가비아 도메인 명의·연락처 이전, README 인수인계 표 갱신
- 학교 공식 모집요강 공고(10월 중순) 후: 입학안내 수치 대조 → 관리자 화면에서 배너·입학 세부 공개 스위치 켜기
- 캠퍼스 사진: 관리자 화면 > 페이지 내용·설정 > 사이트 설정 > 첫 화면 사진
- Google Search Console에 `https://gaimc.kr/sitemap.xml` 등록(검색 노출)
