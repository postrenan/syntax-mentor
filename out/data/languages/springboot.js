"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.springBootDefinition = void 0;
exports.springBootDefinition = {
    id: 'springboot',
    name: 'Spring Boot 3',
    vscodeLanguageIds: ['java', 'yaml', 'properties'],
    fileExtensions: ['.java', 'application.properties', 'application.yml'],
    description: 'Framework líder para ecossistema Java corporativo, microserviços e APIs REST de alta performance.',
    badge: 'Spring Boot 3.x / Java 17+',
    color: '#6db33f',
    snippets: [
        // ==========================================
        // REST CONTROLLERS & ENDPOINTS
        // ==========================================
        {
            id: 'spring-rest-controller',
            title: 'REST Controller Completo com ResponseEntity e Status HTTP',
            category: 'framework_web',
            level: 'Iniciante',
            summary: 'Estrutura padrão de uma API REST retornando status HTTP semânticos (200, 201, 204, 404).',
            keywords: ['restcontroller', 'getmapping', 'postmapping', 'responseentity', 'requestbody', 'pathvariable'],
            completionTrigger: 'spring-rest-crud',
            code: `package com.exemplo.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    // Injeção de dependência via construtor (recomendado pelo Spring):
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos() {
        List<UsuarioResponseDTO> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios); // Retorna 200 OK com corpo
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        UsuarioResponseDTO usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criar(
            @RequestBody @Valid UsuarioRequestDTO dto,
            UriComponentsBuilder uriBuilder
    ) {
        UsuarioResponseDTO salvo = usuarioService.criar(dto);
        // Header 'Location' apontando para o recurso criado (boas práticas REST):
        URI uri = uriBuilder.path("/api/v1/usuarios/{id}").buildAndExpand(salvo.id()).toUri();
        return ResponseEntity.created(uri).body(salvo); // Retorna 201 Created
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }
}`,
            badCode: `// ❌ Anti-padrão: Retornar objetos crus sem controle de status HTTP ou headers
@RestController
public class UsuarioControllerRuim {

    @Autowired // Anti-padrão: Injeção de campo
    private UsuarioRepository repo;

    @PostMapping("/salvarUsuario") // Nomes com verbos violam semântica REST
    public Usuario salvar(Usuario u) {
        return repo.save(u); // Expõe a entidade do banco diretamente na API!
    }
}`,
            badCodeExplanation: "Retornar a entidade do banco de dados expõe dados sensíveis (senhas, auditoria) e gera acoplamento com o schema. Além disso, retornar direto o objeto impede configurar códigos HTTP adequados (ex: 201 Created com cabeçalho Location).",
            explanation: 'O Spring Boot usa @RestController para serializar retornos em JSON automaticamente. Usar ResponseEntity permite controlar o código de status HTTP, headers e o corpo da resposta de forma estritamente alinhada às especificações RESTful.',
            bestPractices: [
                'Sempre use DTOs (Data Transfer Objects) com Java Records para entrada e saída de dados da API.',
                'Retorne 201 Created no POST com o header Location apontando para o novo ID.',
                'Retorne 204 No Content no DELETE quando a exclusão for bem-sucedida.'
            ]
        },
        // ==========================================
        // INJEÇÃO DE DEPENDÊNCIA & SERVICE
        // ==========================================
        {
            id: 'spring-service-injection',
            title: 'Camada de Serviço (@Service) com Injeção por Construtor',
            category: 'framework_web',
            level: 'Iniciante',
            summary: 'Regras de negócio isoladas com injeção segura por construtor e imutabilidade de campos (final).',
            keywords: ['service', 'autowired', 'injecao', 'dependencia', 'transactional'],
            completionTrigger: 'spring-service-layer',
            code: `package com.exemplo.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    // Campos 'final' garantem imutabilidade e inicialização obrigatória:
    private final UsuarioRepository usuarioRepository;
    private final NotificacaoService notificacaoService;

    // Desde o Spring 4.3, o @Autowired é desnecessário em classes com construtor único:
    public UsuarioService(UsuarioRepository usuarioRepository, NotificacaoService notificacaoService) {
        this.usuarioRepository = usuarioRepository;
        this.notificacaoService = notificacaoService;
    }

    @Transactional // Garante rollback automático em caso de RuntimeException
    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new RegraNegocioException("E-mail já cadastrado!");
        }

        Usuario usuario = dto.toEntity();
        Usuario salvo = usuarioRepository.save(usuario);

        notificacaoService.enviarBoasVindas(salvo);
        return UsuarioResponseDTO.fromEntity(salvo);
    }
}`,
            badCode: `// ❌ Anti-padrão: Injeção de dependência diretamente no campo (@Autowired)
@Service
public class UsuarioServiceRuim {

    @Autowired
    private UsuarioRepository usuarioRepository; // Campo mutável e impossível de mockar em testes unitários puros sem reflexão!

    @Autowired
    private NotificacaoService notificacaoService;
}`,
            badCodeExplanation: "A injeção de campo com @Autowired oculta dependências, impede que campos sejam 'final' (imutáveis) e dificulta a escrita de testes unitários isolados com Mockito sem inicializar todo o contexto do Spring.",
            explanation: 'A injeção por construtor é a recomendação oficial do time do Spring. Ela garante que a classe nunca exista em estado incompleto (sem dependências), facilita testes unitários rápidos e permite declarar atributos como "final".',
            bestPractices: [
                'Sempre use injeção por construtor com atributos declarados como final.',
                'Use @Transactional em métodos que alteram dados para garantir consistência ACID.',
                'Se usar Lombok, use @RequiredArgsConstructor para gerar o construtor automaticamente.'
            ]
        },
        // ==========================================
        // SPRING DATA JPA & REPOSITORIES
        // ==========================================
        {
            id: 'spring-data-jpa-entity',
            title: 'Spring Data JPA: Entidade com UUID e Queries Derivadas',
            category: 'database_sql',
            level: 'Intermediário',
            summary: 'Mapeamento objeto-relacional moderno com Jakarta Persistence e métodos mágicos de consulta.',
            keywords: ['jpa', 'entity', 'repository', 'table', 'derived query', 'uuid'],
            completionTrigger: 'spring-jpa-entity',
            code: `// 1. Entidade JPA Moderna:
package com.exemplo.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_usuarios", indexes = {
    @Index(name = "idx_usuario_email", columnList = "email", unique = true)
})
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    // Getters, Setters e construtor padrão obrigatório pelo Hibernate
    public Usuario() {}
}

// 2. Interface de Repositório (Zero implementação manual!):
package com.exemplo.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
    // Derived Query (Spring gera o SQL 'SELECT * FROM tb_usuarios WHERE email = ?'):
    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    // JPQL explícito quando a consulta for complexa:
    @Query("SELECT u FROM Usuario u WHERE LOWER(u.nome) LIKE LOWER(CONCAT('%', :termo, '%'))")
    List<Usuario> buscarPorNomeAproximado(@Param("termo") String termo);
}`,
            explanation: 'O Spring Data JPA implementa a interface em tempo de execução via proxies dinâmicos da JVM, analisando o nome do método (ex: findByEmail) e gerando o SQL correspondente com bind parameters contra SQL Injection.',
            bestPractices: [
                'Prefira UUID ou BIGINT com Sequence em vez de GenerationType.IDENTITY para evitar round-trips extras no banco.',
                'Use Derived Queries para consultas simples e @Query com JPQL para filtros complexos.',
                'Retorne Optional<T> para métodos que buscam por chave única.'
            ]
        },
        // ==========================================
        // TRATAMENTO GLOBAL DE EXCEÇÕES
        // ==========================================
        {
            id: 'spring-global-exception-handler',
            title: 'Global Exception Handler com @ControllerAdvice (RFC 7807)',
            category: 'error_handling',
            level: 'Intermediário',
            summary: 'Centralizador de erros que captura exceções e devolve respostas JSON padronizadas e amigáveis.',
            keywords: ['controlleradvice', 'exceptionhandler', 'rfc7807', 'problemdetails', 'validacao'],
            completionTrigger: 'spring-exception-handler',
            code: `package com.exemplo.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.net.URI;
import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Tratamento para entidade não encontrada (404 Not Found):
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ProblemDetail handleNotFound(RecursoNaoEncontradoException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Recurso Não Encontrado");
        problem.setType(URI.create("https://api.exemplo.com/erros/recurso-nao-encontrado"));
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    // Tratamento automático de validações do Bean Validation (@Valid):
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Erro de Validação de Dados");

        var erros = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(
                fe -> fe.getField(),
                fe -> fe.getDefaultMessage(),
                (antigo, novo) -> antigo
            ));

        problem.setProperty("camposInvalidos", erros);
        return problem;
    }
}`,
            explanation: 'No Spring Boot 3, a classe ProblemDetail implementa a especificação da IETF RFC 7807 para formatação padrão de erros em APIs REST, substituindo classes DTO de erro manuais.',
            bestPractices: [
                'Centralize todos os tratamentos de erro em uma classe @RestControllerAdvice.',
                'Use ProblemDetail nativo do Spring 3+ em vez de criar wrappers customizados.'
            ]
        }
    ]
};
//# sourceMappingURL=springboot.js.map