"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dockerDefinition = void 0;
exports.dockerDefinition = {
    id: 'docker',
    name: 'Docker & Containers',
    vscodeLanguageIds: ['dockerfile', 'yaml'],
    fileExtensions: ['Dockerfile', 'docker-compose.yml', 'docker-compose.yaml', '.dockerignore'],
    description: 'Plataforma líder para empacotamento, distribuição e execução de aplicações em containers isolados.',
    badge: 'Docker / Compose v2',
    color: '#2496ed',
    snippets: [
        // ==========================================
        // DOCKERFILE MULTI-STAGE
        // ==========================================
        {
            id: 'docker-multistage-build',
            title: 'Dockerfile Multi-Stage: Redução Drástica de Tamanho e Segurança',
            category: 'devops_containers',
            level: 'Intermediário',
            summary: 'Separa o ambiente de compilação pesado (JDK/Node) do ambiente de execução mínimo (JRE/Alpine).',
            keywords: ['dockerfile', 'from', 'multistage', 'copy', 'entrypoint', 'alpine', 'workdir'],
            completionTrigger: 'docker-multistage-java',
            code: `# ========================================================
# ETAPA 1: BUILD (Contém JDK completo, Maven/Gradle e código-fonte)
# ========================================================
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# 1. Cache inteligente de dependências (aproveita cache de camadas):
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Copia código-fonte e compila gerando o JAR:
COPY src ./src
RUN mvn clean package -DskipTests

# ========================================================
# ETAPA 2: RUNTIME (Contém apenas o JRE mínimo de produção)
# ========================================================
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# Criação de usuário sem privilégios de root para segurança:
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copia apenas o executável final da etapa de compilação:
COPY --from=builder --chown=appuser:appgroup /app/target/*.jar app.jar

# Porta exposta e comando de inicialização com flags otimizadas:
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]`,
            badCode: `# ❌ Imagem pesada e insegura: compila e executa tudo na mesma imagem
FROM openjdk:21
WORKDIR /app
COPY . .
RUN javac Main.java
# Roda como ROOT por padrão! Tamanho final: ~1GB com ferramentas desnecessárias!
CMD ["java", "Main"]`,
            badCodeExplanation: "Não usar multi-stage build empacota compiladores, ferramentas de build (Maven, npm) e código-fonte cru dentro da imagem de produção, gerando imagens gigabytes maiores e aumentando a superfície de ataques com vulnerabilidades de segurança.",
            explanation: 'O Multi-stage build usa múltiplas instruções FROM. Apenas os artefatos explicitamente copiados com --from=builder são transferidos para a imagem final, resultando em imagens ultraleves (menos de 150MB) e seguras.',
            bestPractices: [
                'Sempre use Multi-Stage builds para compilar binários ou empacotar JARs.',
                'Nunca rode containers de produção como root; crie e use um usuário específico (ex: USER appuser).',
                'Copie arquivos de dependência (pom.xml, package.json) antes do código para maximizar o cache do Docker.'
            ]
        },
        // ==========================================
        // DOCKER COMPOSE ORQUESTRADOR
        // ==========================================
        {
            id: 'docker-compose-stack',
            title: 'Docker Compose: Stack Completa (App + PostgreSQL + Redis)',
            category: 'devops_containers',
            level: 'Iniciante',
            summary: 'Orquestração local declarativa com volumes persistentes, healthchecks e redes isoladas.',
            keywords: ['docker-compose', 'services', 'postgres', 'redis', 'volumes', 'networks', 'healthcheck'],
            completionTrigger: 'docker-compose-stack',
            code: `services:
  # 1. Aplicação Backend
  api-service:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: minha-api
    restart: always
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST=postgres-db
      - DB_PORT=5432
      - DB_NAME=appdb
      - DB_USER=appuser
      - DB_PASSWORD=appsecret
      - REDIS_HOST=redis-cache
    depends_on:
      postgres-db:
        condition: service_healthy # Aguarda o PostgreSQL estar realmente pronto!
    networks:
      - rede-interna

  # 2. Banco de Dados PostgreSQL
  postgres-db:
    image: postgres:16-alpine
    container_name: postgres-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: appsecret
    ports:
      - "5432:5432"
    volumes:
      - dados-postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - rede-interna

  # 3. Cache Redis
  redis-cache:
    image: redis:7-alpine
    container_name: redis-cache
    restart: unless-stopped
    ports:
      - "6379:6379"
    networks:
      - rede-interna

volumes:
  dados-postgres:
    name: volume-dados-postgres

networks:
  rede-interna:
    driver: bridge`,
            explanation: 'O Docker Compose permite subir múltiplos containers interligados por DNS interno automático (o nome do serviço vira o hostname, ex: postgres-db). Volumes garantem persistência dos dados mesmo após destruir os containers.',
            bestPractices: [
                'Use healthchecks com condition: service_healthy para evitar que a aplicação inicie antes do banco estar apto a aceitar conexões.',
                'Use volumes nomeados para persistir bancos de dados.',
                'Isole serviços em networks privadas bridge.'
            ]
        },
        // ==========================================
        // COMANDOS CLI ESSENCIAIS
        // ==========================================
        {
            id: 'docker-cli-essentials',
            title: 'Comandos CLI Essenciais & Gestão de Containers',
            category: 'devops_containers',
            level: 'Iniciante',
            summary: 'Os comandos mais utilizados no dia a dia para construir, rodar, debugar e limpar containers.',
            keywords: ['cli', 'docker run', 'docker ps', 'docker exec', 'docker logs', 'prune'],
            completionTrigger: 'docker-cli-cmds',
            code: `# 1. Construir e Rodar Container com Mapeamento de Portas e Volume:
docker build -t minha-aplicacao:1.0 .
docker run -d -p 8080:8080 --name api-ativa -v logs:/app/logs minha-aplicacao:1.0

# 2. Inspecionar e Monitorar:
docker ps                 # Lista containers em execução
docker ps -a              # Lista todos os containers (inclusive parados)
docker logs -f --tail 100 api-ativa   # Acompanha logs em tempo real
docker stats              # Visualiza consumo de CPU e RAM dos containers

# 3. Interagir dentro do container:
docker exec -it api-ativa sh          # Abre terminal interativo no container

# 4. Limpeza e Liberação de Espaço em Disco:
docker system prune -a --volumes      # Remove containers parados, redes e imagens não usadas
docker volume prune                   # Remove volumes órfãos`,
            explanation: 'Flags essenciais do docker run: -d (detached/segundo plano), -p host:container (redirecionamento de portas), -v host:container (montagem de volumes), --name (nome amigável para o container).',
            bestPractices: [
                'Execute docker system prune periodicamente para liberar gigabytes de imagens antigas em desenvolvimento.',
                'Sempre nomeie containers com --name para facilitar comandos de logs e parada.'
            ]
        }
    ]
};
//# sourceMappingURL=docker.js.map