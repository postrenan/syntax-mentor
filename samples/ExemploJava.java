import java.util.Arrays;
import java.util.List;

public class ExemploJava {
    public static void main(String[] args) {
        String role = "ADMIN";

        // ========================================================
        // 1. ANALISADOR EM TEMPO REAL (Linha com alerta amarelo):
        // Observe o sublinhado de aviso abaixo! 
        // O Analisador do Syntax Mentor detecta que '==' compara
        // endereços no String Pool/Heap em vez de valor.
        // Pressione Ctrl + . (ou clique na lâmpada 💡) para aplicar o Quick Fix automático!
        // ========================================================
        if (role == "ADMIN") {
            System.out.println("Acesso concedido!");
        }

        // ========================================================
        // 2. AUTOCOMPLETAR DIDÁTICO:
        // Digite na linha abaixo: "java-string-pool" ou "java-stream" ou "mentor-"
        // e veja o IntelliSense com documentação didática completa!
        // ========================================================
        
        
        // ========================================================
        // 3. HOVER DIDÁTICO:
        // Passe o mouse sobre 'String' ou 'StringBuilder' ou 'List'
        // para abrir o guia conceitual explicativo.
        // ========================================================
        StringBuilder sb = new StringBuilder();
        List<String> frutas = List.of("Maçã", "Banana");
    }

    // ========================================================
    // 4. DETECÇÃO DE BLOCO CATCH VAZIO:
    // O Analisador avisa contra engolir exceções silenciosamente:
    // ========================================================
    public static void exemploCatch() {
        try {
            int resultado = 10 / 0;
        } catch (ArithmeticException e) {}
    }
}
