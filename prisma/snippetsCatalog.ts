export const SNIPPETS_CATALOG = {
  JavaScript: [
    {
      title: "Debounce simples",
      description: "Função debounce para evitar múltiplas execuções seguidas.",
      tags: ["frontend", "utils"],
      code: `function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`
    },
    {
      title: "Fetch com timeout",
      description: "Wrapper para fetch com timeout customizado.",
      tags: ["web", "backend"],
      code: `async function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  const res = await fetch(url, { signal: controller.signal });
  clearTimeout(id);
  return res.json();
}`
    }
  ],

  TypeScript: [
    {
      title: "Tipo utilitário para tornar campos opcionais",
      description: "Exemplo de Partial personalizado.",
      tags: ["typescript", "utils"],
      code: `type Optional<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: T[P];
};`
    },
    {
      title: "Guard de tipo para checar string",
      description: "Type guard simples em TypeScript.",
      tags: ["typescript"],
      code: `function isString(value: unknown): value is string {
  return typeof value === "string";
}`
    }
  ],

  Python: [
    {
      title: "Contar ocorrências em lista",
      description: "Usando Counter para simplificar contagem.",
      tags: ["backend", "algoritmo"],
      code: `from collections import Counter

lista = ["a", "b", "a", "c", "b", "a"]
contagem = Counter(lista)
print(contagem)`
    },
    {
      title: "Ler arquivo JSON",
      description: "Leitura de JSON com tratamento básico de exceções.",
      tags: ["filesystem"],
      code: `import json

try:
    with open("data.json") as f:
        dados = json.load(f)
except FileNotFoundError:
    print("Arquivo não encontrado.")`
    }
  ],

  Java: [
    {
      title: "Ler arquivo linha por linha",
      description: "Uso de BufferedReader de forma segura.",
      tags: ["filesystem", "backend"],
      code: `try (BufferedReader br = new BufferedReader(new FileReader("input.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
}`
    },
    {
      title: "Singleton thread-safe",
      description: "Implementação moderna usando holder.",
      tags: ["design-patterns"],
      code: `public class Config {
    private Config() {}

    private static class Holder {
        static final Config INSTANCE = new Config();
    }

    public static Config getInstance() {
        return Holder.INSTANCE;
    }
}`
    }
  ],

  "C#": [
    {
      title: "Consumir API com HttpClient",
      description: "Exemplo assíncrono simples.",
      tags: ["backend", "web"],
      code: `using var client = new HttpClient();
var response = await client.GetStringAsync("https://api.exemplo.com");
Console.WriteLine(response);`
    },
    {
      title: "LINQ filtrar lista",
      description: "Uso básico de LINQ.",
      tags: ["linq"],
      code: `var numeros = new List<int> {1,2,3,4,5};
var pares = numeros.Where(n => n % 2 == 0);
Console.WriteLine(string.Join(", ", pares));`
    }
  ],

  Go: [
    {
      title: "Limitar concorrência com semáforo",
      description: "Controle de goroutines simultâneas.",
      tags: ["concurrency", "backend"],
      code: `sem := make(chan struct{}, 5)
for _, job := range jobs {
    sem <- struct{}{}
    go func(j Job) {
        process(j)
        <-sem
    }(job)
}`
    },
    {
      title: "HTTP server básico",
      description: "Servindo endpoint simples.",
      tags: ["web"],
      code: `http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Olá mundo!")
})
http.ListenAndServe(":8080", nil)`
    }
  ],

  Rust: [
    {
      title: "Ler arquivo para string",
      description: "Uso de std::fs::read_to_string.",
      tags: ["filesystem"],
      code: `use std::fs;

fn main() {
    let conteudo = fs::read_to_string("arquivo.txt")
        .expect("Erro ao ler arquivo");
    println!("{}", conteudo);
}`
    },
    {
      title: "Somar valores com iteradores",
      description: "Uso idiomático de iteradores no Rust.",
      tags: ["algoritmo"],
      code: `let nums = vec![1, 2, 3, 4];
let soma: i32 = nums.iter().sum();
println!("{}", soma);`
    }
  ],

  PHP: [
    {
      title: "PDO conexão simples",
      description: "Conectar ao MySQL com tratamento básico.",
      tags: ["database"],
      code: `$pdo = new PDO("mysql:host=localhost;dbname=test", "root", "");
$stmt = $pdo->query("SELECT * FROM users");
foreach ($stmt as $row) {
    echo $row["name"], PHP_EOL;
}`
    },
    {
      title: "Função para sanitizar strings",
      description: "Filtro básico contra XSS.",
      tags: ["security"],
      code: `function sanitize($str) {
    return htmlspecialchars($str, ENT_QUOTES, "UTF-8");
}`
    }
  ]
};
