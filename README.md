
## 📑 목차
- [🚀 Quick Start - 서버 구동 가이드](#quick-start---서버-구동-가이드)
- [🐳 Docker 실행 가이드](#docker-실행-가이드)
- [🔧 서버 구동 가이드](#서버-구동-가이드)
- [🗺️ ERD](#erd)
- [📖 API Swagger 문서](#api-swagger-문서)
- [🗂️ 디렉토리 구조](#디렉토리-구조)

<br/>
  

# 🛍️ Mobinity API
동적 할인 정책과 사용자 맞춤 가격을 제공하는 상품 조회 REST API 개인 프로젝트입니다. <br>
요일별 할인 정책과 사용자 유형별 가격 설정을 통해 맞춤형 쇼핑 경험을 제공하는 것을 목표로 설계되었습니다.

#### 📅 개발 기간
2024.09.12 ~ 2024.09.20

#### 🛠️ 개발 환경

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![TypeORM](https://img.shields.io/badge/TypeORM-262627?style=for-the-badge&logo=typeorm&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

<br/>

-----

## Quick Start - 서버 구동 가이드

### 🛒 프로젝트 클론 
```
git clone https://github.com/joosomi/mobinity.git
```

###  ⚙️ 환경 변수 설정 (.env 파일)

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고, 다음과 같은 환경 변수를 설정하세요:

```bash
# 애플리케이션 설정
NODE_ENV=         # 애플리케이션 환경 설정 (development, production)
APP_PORT=         # 애플리케이션이 실행될 포트

# PostgreSQL 데이터베이스 설정
POSTGRES_USER=               # PostgreSQL 사용자 이름
POSTGRES_PASSWORD=           # PostgreSQL 사용자 비밀번호
POSTGRES_DB=                 # 사용할 데이터베이스 이름
POSTGRES_HOST=localhost      # 데이터베이스 호스트 (개발환경 : localhost, 배포 환경: 도커 서비스 이름 설정 가능)
POSTGRES_PORT=               # PostgreSQL 데이터베이스 포트

#DB seeding) 사용자 비밀번호
DEFAULT_USER_PASSWORD=

#JWT secret key
JWT_SECRET=
```
<br/>

-------

## Docker 실행 가이드

프로젝트의 데이터베이스 서비스를 Docker로 실행하려면, 아래 단계를 따르세요.

#### 1. Docker Compose 설정 확인

루트 디렉토리에 있는 `docker-compose.yml` 파일을 확인하고, `.env` 파일이 제대로 설정되었는지 확인하세요.

#### 2. Docker 컨테이너 실행

아래 명령어를 사용하여 Docker 컨테이너를 백그라운드에서 실행합니다:

```bash
docker-compose up -d
```

- image: postgres:15.7 버전의 PostgreSQL을 사용합니다.
- `db-init.sh` 스크립트: Docker로 PostgreSQL 컨테이너가 처음 실행될 때 자동으로 실행됩니다. <br>
    데이터베이스를 생성하고, 환경변수로 설정한 이름, 비밀번호의 사용자 생성 및 권한을 부여합니다.


#### 3.	Docker 컨테이너 상태 확인
```
docker ps
```
실행 중인 컨테이너 목록에서 PostgreSQL 컨테이너가 정상적으로 실행되고 있는지 확인합니다.

---

## 서버 구동 가이드

#### 1. 패키지 설치

Docker 컨테이너가 실행된 후, 프로젝트의 모든 의존성을 설치해야 합니다.

```bash
npm install
```

#### 2. DB seeding

시딩을 통해 초기 데이터를 생성할 수 있습니다.

```bash
npm run seed [숫자]
## [숫자] 자리에 생성할 데이터의 수를 입력하세요.
## 예) npm run seed 20
```

- `UserType`: 기본 사용자 유형으로 BRONZE, SILVER, GOLD, VIP 유형으로 데이터가 생성됩니다.
- `DiscountPolicy`: 기본 할인 정책이 생성됩니다. (Monday Discount Policy, 할인율 0%)
- `DiscountDaysOfWeek`: 각 요일에 대한 할인 정책으로, 월요일(1)은 추가 1% 할인율이 적용되며, 나머지 요일은 0% 할인이 되도록 초기 데이터가 시딩됩니다.

#### 3. 서버 실행

서버 실행

```
npm run start
```

개발 모드 실행

```
npm run start:dev
```
<br/>

---

## ERD

![ERD 다이어그램](/docs/erd.png)

- `user_type` 테이블: 새로운 사용자 유형이 추가될 때를 대비해 따로 테이블을 두었습니다.
- `user_types_product_price`: 사용자 유형별로 상품 가격을 설정하는 테이블입니다.여기서 가격 정보가 없을 경우 product 테이블의 기본 가격(basePrice)을 사용하여 할인된 가격을 계산하게 됩니다.
- `discount_policy(기본 할인 정책)` 및 `discount_days_of_week(요일별 추가 할인)`: 현재는 요일별 추가 할인을 기본 할인 정책에 추가 할인을 적용하는 방식으로 설계되었습니다. <br>
  향후 사용자 유형(UserType), 브랜드(Brand), 상품(Product) 등 다양한 조건에 맞춘 할인 정책을 추가 테이블로 확장하여 관리할 수 있도록 설계했습니다.

<br/>

---

## API Swagger 문서

Swagger 문서를 통해 API 명세를 확인할 수 있습니다.
API 요청을 테스트하고, 각 엔드포인트의 상세 정보를 확인할 수 있습니다.
`.env`의 APP_PORT 포트 번호로 변경 후 확인이 가능합니다.

```
http://localhost:<APP_PORT>/api-docs
```

![Swagger](/docs/swagger.png)

<details>
  <summary>📝 API 명세서 보기</summary>

### 1.1 회원가입

```
POST api/auth/register
```

새로운 사용자 계정을 생성합니다. 기본 사용자 유형인 'BRONZE' 유형으로 가입됩니다.

**요청 본문 예시:**

```json
{
  "username": "john_doe",
  "email": "example@example.com",
  "password": "strong_password_123"
}
```

**응답:**

- `204 No Content`: 회원가입 성공
- `400 Bad Request`: 계정명, 이메일, 비밀번호가 빈 값이거나, 잘못된 형식일 경우
- `404 Not Found` : 기본 UserType을 찾지 못하여 회원가입이 불가능한 경우
- `409 Conflict`: 이미 존재하는 계정명, 이메일로 가입을 시도하는 경우

### 1.2 로그인

```
POST api/auth/login
```

사용자가 로그인하며, 성공 시 액세스 토큰이 발급됩니다.

**요청 본문 예시:**

```json
{
  "username": "john_doe",
  "password": "strong_password_123"
}
```

**응답:**

- `200 OK`: 로그인 성공 및 액세스 토큰 발급
- `400 Bad Request`:계정명이나 비밀번호가 빈 값인 경우
- `401 Unauthorized`:
  유효하지 않은 계정명일 때: “유효하지 않은 계정명입니다.”
  비밀번호가 일치하지 않을 때: “비밀번호가 일치하지 않습니다.”

### 2.1 상품 목록 조회

```
GET /api/products
```

상품 목록을 페이지네이션하여 조회합니다. 로그인된 사용자의 경우, 상품의 기본 가격, 사용자 유형별 상품 가격, 할인이 적용된 최종 가격, 총 할인율 정보를 포함하여 반환합니다.

**Query Parameters**:

- page (number, optional): 페이지 번호 (기본값: 1)
- limit (number, optional): 페이지 당 항목 수 (기본값: 10)

**응답:**

- `200 OK`: 성공적으로 상품 목록 조회, 페이지네이션 정보를 포함한 응답 반환.

**비로그인한 사용자의 경우 응답 예시**

```json
{
  "products": [
    {
      "id": "0377f6f1-1074-4878-b80d-92a9fa48c217",
      "name": "Bespoke Concrete Ball",
      "description": "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J",
      "brand": {
        "id": "2366dc47-38a6-415d-8045-62d50b5b032a",
        "krName": "회사 9",
        "enName": "Wisozk, Halvorson and Fay",
        "description": "Right-sized zero tolerance extranet"
      }
    }
  ],
  "pagination": {
    "totalCount": 20,
    "currentPage": 1,
    "totalPages": 20,
    "limit": 1
  }
}
```

**로그인한 사용자의 경우 응답 예시**

```json
{
  "products": [
    {
      "id": "0377f6f1-1074-4878-b80d-92a9fa48c217",
      "name": "Bespoke Concrete Ball",
      "description": "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J",
      "brand": {
        "id": "2366dc47-38a6-415d-8045-62d50b5b032a",
        "krName": "회사 9",
        "enName": "Wisozk, Halvorson and Fay",
        "description": "Right-sized zero tolerance extranet"
      },
      "basePrice": 932730,
      "userTypePrice": 537046,
      "finalPrice": 531676,
      "totalDiscountRate": 1
    }
  ],
  "pagination": {
    "totalCount": 20,
    "currentPage": 1,
    "totalPages": 20,
    "limit": 1
  }
}
```

### 2.2 브랜드별 상품 목록 조회

```
GET /api/products/brand
```

브랜드 이름(한글 또는 영어)으로 검색하여 해당 브랜드에 속하는 상품 목록을 페이지네이션하여 조회합니다.

**Query Parameters**:

- brandName (string, required): 조회할 브랜드의 이름입니다. 한글 또는 영어로 입력할 수 있습니다.
- page (number, optional): 페이지 번호 (기본값: 1)
- limit (number, optional): 페이지 당 항목 수 (기본값: 10)

**응답:**

- `200 OK`: 성공적으로 브랜드별 상품 목록 조회, 페이지네이션 정보를 포함한 응답 반환.
- `400 Bad Request`:브랜드 명을 공백으로 검색한 경우 : “검색할 브랜드 명을 입력해주세요.”

**응답 예시**

```json
{
  "products": [
    {
      "id": "e5bc853a-b0c1-46b4-8668-3f9f3113e7a6",
      "name": "Small Wooden Shoes",
      "description": "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J",
      "brand": {
        "id": "344ba950-c8f3-4473-bacd-60e19c950242",
        "krName": "회사 2",
        "enName": "Dietrich LLC"
      },
      "basePrice": 938841,
      "finalPrice": 929453,
      "totalDiscountRate": 1
    }
  ],
  "pagination": {
    "totalCount": 1,
    "currentPage": 1,
    "totalPages": 1,
    "limit": 10
  }
}
```

**Request URL 예시**:

```
http://localhost:<APP_PORT>/api/products/brand?brandName=%ED%9A%8C%EC%82%AC%202&page=1&limit=10

```
</details>

<br/>

---
## 디렉토리 구조

<details>
   <summary>디렉토리 구조 보기</summary>

  
```
...
├── logs
│   ├── combined.log
│   └── error.log
├── database
│   └── db-init.sh
├── nest-cli.json
├── package-lock.json
├── package.json
├── src
│   ├── app.module.ts
│   ├── auth
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.service.ts
│   │   ├── decorators
│   │   │   └── public.decorator.ts
│   │   ├── guards
│   │   │   └── optional-jwt-auth.guard.ts
│   │   ├── strategies
│   │   │   └── jwt.strategy.ts
│   │   └── types
│   │       └── jwt.type.ts
│   ├── config
│   │   └── winston.config.ts
│   ├── db
│   │   ├── data-source.ts
│   │   └── seeds
│   │       └── seeder.ts
│   ├── entities
│   │   ├── base.entity.ts
│   │   ├── brand.entity.ts
│   │   ├── discount-days-of-week.entity.ts
│   │   ├── discount-policy.entity.ts
│   │   ├── product.entity.ts
│   │   ├── user-type-product-price.entity.ts
│   │   ├── user-type.entity.ts
│   │   └── user.entity.ts
│   ├── filter
│   │   └── global-exception.filter.ts
│   ├── main.ts
│   ├── products
│   │   ├── dto
│   │   │   ├── brand-product-response.dto.ts
│   │   │   ├── get-brand-products.dto.ts
│   │   │   ├── get-products-query.dto.ts
│   │   │   └── paginated-product-response.dto.ts
│   │   ├── products.controller.spec.ts
│   │   ├── products.controller.ts
│   │   ├── products.module.ts
│   │   ├── products.service.spec.ts
│   │   └── products.service.ts
│   └── users
│       ├── dto
│       │   ├── create-user.dto.ts
│       │   └── login.dto.ts
│       ├── users.controller.spec.ts
│       ├── users.controller.ts
│       ├── users.module.ts
│       ├── users.service.spec.ts
│       └── users.service.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```
</details>
