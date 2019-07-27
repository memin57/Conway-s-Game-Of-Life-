
let grid; // Array ismi 
let columns; // Array'in sütun değişkeni  
let rows; // Array'in satır değişkeni
let resolution = 10; // bir hücrenin boyutu 

// bu fonksiyon 2 boyutlu array oluşturur
function CreateArray2D(columns, rows) {
    let arr = new Array(columns);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  }
  
function setup() {
    createCanvas(500, 500); // createCanvas diktdörtgen alan olşturur canvas HTML sayfasındaki dikdörtgen alandır  boyutu 500*500 
    columns = width / resolution; // sütunun dikdörtgen boyutuna göre kaç hücreden oluşacağını belirler 
    rows = height / resolution; // satırın dikdörtgen boyutuna göre kaç hücreden oluşacağını belirler

    grid = CreateArray2D(columns, rows); // CreateArray2D fonksiyonunda oluşturulan array grid'e atanıyor.
   
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = floor(random(2)); // random fonksiyonu ile elde edilen 0,1 sayıları grid array'ine atanıyor 
      }
    }
}

function draw() {
    background(100); // arka plan renginin koyuluğunu ayarlar ayrıca bu renk ölü olan hücreleri temsil eder
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * resolution; //  dikdörtgen üzerindeki x pixel kordinatı 
        let y = j * resolution;//   dikdörtgen üzerindeki y pixel kordinatı 
        if (grid[i][j] == 1) {  // eğer array'in i sütun ve j satırındaki değer 1 (1 değeri canlı hücre demek) ise o hücreyi beyaz yap. 
          fill(255); // canlı olan hücrenin rengini beyaz yapar 
          stroke(0); // canvasta hücreler arasına çizgi çekmek için kullanılır içindeki değere göre çizginin belirliliği artar veya azalır  
          rect(x, y, resolution, resolution); // 
        }
      }
    }

    let next = CreateArray2D(columns, rows); // sonraki level için tekrar array oluşturur. 
  
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j]; // grid array'indeki değer state değişkenine atanır 
      
        let neighbors = NumberOfNeighbors(grid, i, j);//NumberOfNeighbors fonksiyonunda elde edilen toplam komşu sayısı neighbors değişkenine atanır
  
        if (state == 0 && neighbors == 3) { // 1. Kural: Bir ölü hücrenin tam olarak üç canlı komşusu varsa canlanır.
          next[i][j] = 1;
        } 
        else if (state == 1 && (neighbors < 2 || neighbors > 3)) { // 2. Kural:  Bir canlı hücrenin, iki'den daha az canlı komşusu varsa "yalnızlık nedeniyle" ölür 
          next[i][j] = 0;                               //veya Bir canlı hücrenin, üç'ten daha fazla canlı komşusu varsa "kalabalıklaşma nedeniyle" ölür
        } 
        else {  // 3. Kural: Bir canlı hücrenin, iki ya da üç canlı komşusu varsa değişmeden bir sonraki nesile kalır
          next[i][j] = state; // state'teki girid'den alınan eski değer next array'ine atanır 
        }
      }
    }
    grid = next; // next array'indeki değer tekrar gird array'ine atanır. *******
}
  // bu fonksiyon canlı komşuları sayar 
function NumberOfNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) { // i ve j ' nin -1 ile 2 arasında olmasının nedeni bir hücrenin kendisi sıfır
      for (let j = -1; j < 2; j++) {             // öncesi -1 sonrası 1 olmasıdır böylece 8 komşuyada erişir
        let col = (x + i + columns) % columns; // bu formül dikdörtgenin kenarındaki
                            // hücrelere erişim ve dikdörtgenin dışına çıkmaması için  
                            //örneğin j = -1 x = 1 columns = 20 olursa (1+(-1)+21) % 20 burdan 1 gelir hücrenin sütunu 1 olur
        let row = (y + j + rows) % rows; // bu formül dikdörtgenin kenarındaki 
                           //hücrelere erişim ve dikdörtgenin dışına çıkmaması için 
                           // örneğin j = 1 x = 49 rows = 50 olursa (49+1+50) % 50 burdan 0 gelir hücrenin satırı 0 olur
        sum += grid[col][row];  
      }
    }
    sum -= grid[x][y]; // toplam komşu sayısından kendimizi çıkarıyoruz çünkü yurkarda döngü içerisinde kendimizide komşu olarak sayıyoruz.
    return sum;
}