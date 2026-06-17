# Video Streaming Backend

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success" alt="status">
  <img src="https://img.shields.io/badge/node.js-20-green" alt="node">
  <img src="https://img.shields.io/badge/typescript-5-blue" alt="typescript">
  <img src="https://img.shields.io/badge/postgresql-17-blue" alt="postgresql">
  <img src="https://img.shields.io/badge/rabbitmq-workers-orange" alt="rabbitmq">
  <img src="https://img.shields.io/badge/cloudflare-r2-f38020" alt="cloudflare-r2">
  <img src="https://img.shields.io/badge/ffmpeg-transcoding-red" alt="ffmpeg">
  <img src="https://img.shields.io/badge/streaming-hls-purple" alt="hls">
  <img src="https://img.shields.io/badge/license-MIT-brightgreen" alt="license">
</p>

<p align="center">
  Backend escalável para streaming de vídeos desenvolvido com TypeScript, PostgreSQL, RabbitMQ, Cloudflare R2 e FFmpeg.
  <br />
  Suporta uploads multipart, processamento assíncrono, streaming adaptativo (HLS) e entrega de mídia em arquitetura cloud-native 🚀
</p>

---

## Funcionalidades

### Pipeline de Upload

* Upload multipart para arquivos de vídeo grandes
* Geração de URLs pré-assinadas
* Suporte à retomada de upload através de checkpoints
* Integração com armazenamento de objetos Cloudflare R2
* Rastreamento de progresso de upload

### Processamento de Vídeo

* Processamento assíncrono utilizando RabbitMQ
* Transcodificação baseada em FFmpeg
* Geração de HLS com múltiplas taxas de bits
* Playlists de streaming adaptativo
* Geração automática de variantes baseada na resolução do vídeo de origem

### Entrega de Streaming

* Geração de playlist mestre HLS
* Entrega segmentada de vídeo (`.ts`)
* Múltiplos níveis de qualidade:

  * 360p
  * 720p
  * 1080p
* Otimizado para distribuição via CDN

### Infraestrutura

* Persistência em PostgreSQL
* Filas de mensagens com RabbitMQ
* Armazenamento Cloudflare R2
* Suporte a Docker
* Arquitetura baseada em Workers

---

## Arquitetura

<img src="https://pub-5717427986ac4c38b882d189950f1a01.r2.dev/video-infra.png">

---

## Stack Tecnológica

### Backend

* TypeScript
* Node.js
* Express
* TypeORM

### Banco de Dados

* PostgreSQL

### Armazenamento

* Cloudflare R2

### Mensageria

* RabbitMQ

### Processamento de Mídia

* FFmpeg
* HLS

---

## Fluxo de Upload

### 1. Criar Vídeo

```http
POST /videos
```

Body:

```json
{
  "title": "title-exemple",
  "description": "description-exemple",
  "size": "300000",
  "mimeType": "video/mp4",
}
```

### 2. Gerar URLs de Upload Multipart

```http
POST /videos/presigned-urls/:id
```

Body:

```json
{
  "parts": 250
}
```

### 3. Upload dos Chunks

O cliente envia os chunks diretamente para o Cloudflare R2 utilizando as URLs pré-assinadas.

### 4. Finalizar Upload

```http
POST /videos/complete-upload/:id
```
Body:

```json
{
  "parts": [
    {
      "partNumber": 1,
      "etag": "etag-exemple"
    }
  ]
}
```

O upload é finalizado e um trabalho de processamento é enviado para o RabbitMQ.

### 5. Processamento de Vídeo

O worker:

1. Baixa o vídeo original.
2. Extrai os metadados.
3. Gera as versões HLS.

---

### 6. Upload dos Vídeos Gerados

O worker:

1. Envia os arquivos gerados para o Cloudflare R2.
2. Atualiza o status do vídeo.

---

## Estrutura HLS

```text
videos/
└── {videoId}
    ├── original
    └── hls
        ├── master.m3u8
        ├── 360p
        │   ├── playlist.m3u8
        │   └── segment_001.ts
        ├── 720p
        │   ├── playlist.m3u8
        │   └── segment_001.ts
        └── 1080p
            ├── playlist.m3u8
            └── segment_001.ts
```

---

## Variáveis de Ambiente

```env
# DATABASE
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_PORT=
DB_HOST=

# R2 - CloudFlare
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=

# R2 - Bucket de Vídeos Originais
R2_ORIGINALS_BUCKET=

# R2 - Bucket de Vídeos HLS
R2_HLS_BUCKET=
R2_HLS_BUCKET_PUBLIC_URL=

# RABBITMQ - Fila
RABBITMQ_URL=
```

---

## Executando Localmente

### Iniciar Infraestrutura

```bash
docker compose up -d
```

### Instalar Dependências

```bash
npm install
```

### Executar Migrations

```bash
npm run migration:run
```

### Iniciar API

```bash
npm run dev:server
```

### Iniciar Worker

```bash
npm run dev:worker-hls
```

```bash
npm run dev:worker-video
```

Ou executar ambos:

```bash
npm run dev
```

---

## Melhorias Futuras

* Geração de thumbnails
* Suporte a DRM
* Analytics de vídeo
* Processamento de legendas
* Workers distribuídos
* Invalidação automática de cache CDN
* Pipeline de moderação de vídeos
* Notificações via webhook

---

## Objetivos do Projeto

Este projeto foi desenvolvido para explorar conceitos reais de arquitetura de plataformas de streaming de vídeo, incluindo:

* Upload multipart
* Armazenamento de objetos
* Filas de mensagens
* Processamento assíncrono
* Transcodificação de mídia
* Streaming adaptativo por bitrate
* Escalabilidade cloud-native

A arquitetura segue padrões amplamente utilizados por plataformas modernas de streaming e serviços de processamento de mídia.

---

## Descrição do Repositório

Backend escalável para streaming de vídeos desenvolvido com TypeScript, PostgreSQL, RabbitMQ, Cloudflare R2 e FFmpeg. Suporta uploads multipart, processamento assíncrono, streaming adaptativo HLS, retomada de uploads e entrega de mídia em arquitetura cloud-native.
