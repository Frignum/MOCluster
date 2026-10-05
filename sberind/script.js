/* ============================================
   1. НАВИГАЦИЯ — подсветка активной секции
   ============================================ */
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.side-nav .dot');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      dots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === '#' + id));
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

/* ============================================
   2. АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ
   ============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

sections.forEach(s => revealObserver.observe(s));

/* ============================================
   3. ДАННЫЕ ДЛЯ ГРАФИКА
   ДАННЫЕ: замените массивы ниже на свои значения.
   - labels: подписи по оси X (годы, месяцы)
   - datasets: ряды. Добавляйте/удаляйте по необходимости.
   ============================================ */
const chartData = {
  labels: ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'],
  datasets: [
    {
      label: 'Ряд 1',                    // ДАННЫЕ
      data: [10, 14, 18, 22, 28, 24, 32, 40, 48, 55, 62], // ДАННЫЕ
      borderColor: '#a3e635',
      backgroundColor: 'rgba(163,230,53,0.1)',
      fill: true,
      tension: 0.35,
      pointRadius: 0,
      pointHoverRadius: 5,
      borderWidth: 2.5
    },
    {
      label: 'Ряд 2',                    // ДАННЫЕ
      data: [8, 10, 12, 15, 20, 18, 24, 28, 34, 38, 44], // ДАННЫЕ
      borderColor: '#6b8f1f',
      backgroundColor: 'rgba(107,143,31,0.05)',
      fill: false,
      tension: 0.35,
      pointRadius: 0,
      pointHoverRadius: 5,
      borderWidth: 2,
      borderDash: [6, 4]
    }
  ]
};

/* ============================================
   4. ИНИЦИАЛИЗАЦИЯ ГРАФИКА
   ============================================ */
const ctx = document.getElementById('mainChart').getContext('2d');

const mainChart = new Chart(ctx, {
  type: 'line',
  data: chartData,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600 },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        labels: {
          color: '#e8f0e5',
          font: { family: 'Inter', size: 13 },
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#a3e635',
        borderWidth: 1,
        titleColor: '#0f2419',
        bodyColor: '#1a1a1a',
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Inter', size: 13 },
        bodyFont: { family: 'Inter', size: 13 }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#8a8a8a', font: { family: 'Inter', size: 12 } }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#8a8a8a', font: { family: 'Inter', size: 12 } }
      }
    }
  }
});

/* ============================================
   5. ПОЛЗУНОК ВРЕМЕНИ
   Ограничивает отображение графика выбранным диапазоном.
   ============================================ */
const slider = document.getElementById('timeSlider');
const yearCurrent = document.getElementById('yearCurrent');
const yearStart = document.getElementById('yearStart');
const yearEnd = document.getElementById('yearEnd');

const allLabels = chartData.labels;
slider.min = 0;
slider.max = allLabels.length - 1;
slider.value = allLabels.length - 1;

yearStart.textContent = allLabels[0];
yearEnd.textContent = allLabels[allLabels.length - 1];
yearCurrent.textContent = allLabels[allLabels.length - 1];

function updateChartBySlider(index) {
  const visibleLabels = allLabels.slice(0, index + 1);
  mainChart.data.labels = visibleLabels;
  mainChart.data.datasets.forEach((ds, i) => {
    ds.data = chartData.datasets[i].data.slice(0, index + 1);
  });
  mainChart.update();
  yearCurrent.textContent = allLabels[index];
}

slider.addEventListener('input', (e) => {
  updateChartBySlider(parseInt(e.target.value));
});

/* ============================================
   6. ПЛАВНАЯ ПРОКРУТКА ПО КЛИКУ НА ТОЧКУ
   ============================================ */
dots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(dot.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});