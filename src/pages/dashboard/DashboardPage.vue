<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiCalendarCheck, mdiAccountMultiple, mdiTimerSand, mdiChartLine } from '@mdi/js'
import Chart from 'chart.js/auto'

// Dados simulados para o dashboard
const dailyData = ref([
  { date: '01/04', agendamentos: 24, atendimentos: 20 },
  { date: '02/04', agendamentos: 18, atendimentos: 17 },
  { date: '03/04', agendamentos: 29, atendimentos: 25 },
  { date: '04/04', agendamentos: 32, atendimentos: 28 },
  { date: '05/04', agendamentos: 26, atendimentos: 25 },
  { date: '06/04', agendamentos: 15, atendimentos: 14 },
  { date: '07/04', agendamentos: 10, atendimentos: 9 },
  { date: '08/04', agendamentos: 30, atendimentos: 26 },
  { date: '09/04', agendamentos: 25, atendimentos: 22 },
  { date: '10/04', agendamentos: 22, atendimentos: 20 }
])

const especialidadesData = ref([
  { name: 'Clínica Geral', atendimentos: 45, color: '#8884d8' },
  { name: 'Cardiologia', atendimentos: 28, color: '#83a6ed' },
  { name: 'Pediatria', atendimentos: 38, color: '#8dd1e1' },
  { name: 'Ortopedia', atendimentos: 22, color: '#82ca9d' },
  { name: 'Dermatologia', atendimentos: 15, color: '#ffc658' }
])

const slaData = ref([
  { name: 'Dentro do SLA', value: 85, color: 'success' },
  { name: 'Fora do SLA', value: 15, color: 'error' }
])

const tempoMedioData = ref([
  { name: 'Clínica Geral', tempo: 25, sla: 30 },
  { name: 'Cardiologia', tempo: 35, sla: 30 },
  { name: 'Pediatria', tempo: 22, sla: 30 },
  { name: 'Ortopedia', tempo: 40, sla: 45 },
  { name: 'Dermatologia', tempo: 30, sla: 30 }
])

// Instâncias dos gráficos
const charts = ref<{ [key: string]: Chart | null }>({
  lineChart: null,
  pieChart: null,
  barChart: null,
  barChartHorizontal: null
})

// Configurações do filtro de período
const timeframe = ref('week')
const isLoading = ref(false)

// Funções computadas para métricas
const totalAgendamentos = computed(() =>
  dailyData.value.reduce((sum, item) => sum + item.agendamentos, 0)
)

const totalAtendimentos = computed(() =>
  dailyData.value.reduce((sum, item) => sum + item.atendimentos, 0)
)

const taxaAtendimento = computed(() =>
  Math.round((totalAtendimentos.value / totalAgendamentos.value) * 100)
)

const tempoMedioGeral = computed(
  () =>
    tempoMedioData.value.reduce((sum, item) => sum + item.tempo, 0) / tempoMedioData.value.length
)

// Simulação de carregamento de dados ao mudar o período
const changeTimeframe = (newTimeframe: string) => {
  isLoading.value = true
  timeframe.value = newTimeframe

  // Simula um delay para mostrar o loading
  setTimeout(() => {
    if (newTimeframe === 'week') {
      // Dados originais
      dailyData.value = [
        { date: '01/04', agendamentos: 24, atendimentos: 20 },
        { date: '02/04', agendamentos: 18, atendimentos: 17 },
        { date: '03/04', agendamentos: 29, atendimentos: 25 },
        { date: '04/04', agendamentos: 32, atendimentos: 28 },
        { date: '05/04', agendamentos: 26, atendimentos: 25 },
        { date: '06/04', agendamentos: 15, atendimentos: 14 },
        { date: '07/04', agendamentos: 10, atendimentos: 9 },
        { date: '08/04', agendamentos: 30, atendimentos: 26 },
        { date: '09/04', agendamentos: 25, atendimentos: 22 },
        { date: '10/04', agendamentos: 22, atendimentos: 20 }
      ]
    } else if (newTimeframe === 'month') {
      // Faz uma pequena alteração nos dados para simular a mudança
      dailyData.value = [
        { date: '01/04', agendamentos: 29, atendimentos: 24 },
        { date: '02/04', agendamentos: 22, atendimentos: 20 },
        { date: '03/04', agendamentos: 35, atendimentos: 30 },
        { date: '04/04', agendamentos: 38, atendimentos: 34 },
        { date: '05/04', agendamentos: 31, atendimentos: 29 },
        { date: '06/04', agendamentos: 18, atendimentos: 16 },
        { date: '07/04', agendamentos: 12, atendimentos: 11 },
        { date: '08/04', agendamentos: 36, atendimentos: 31 },
        { date: '09/04', agendamentos: 30, atendimentos: 26 },
        { date: '10/04', agendamentos: 26, atendimentos: 24 }
      ]
    } else if (newTimeframe === 'quarter') {
      // Faz uma alteração maior nos dados para simular trimestre
      dailyData.value = [
        { date: '01/04', agendamentos: 36, atendimentos: 30 },
        { date: '02/04', agendamentos: 27, atendimentos: 24 },
        { date: '03/04', agendamentos: 44, atendimentos: 38 },
        { date: '04/04', agendamentos: 48, atendimentos: 42 },
        { date: '05/04', agendamentos: 39, atendimentos: 35 },
        { date: '06/04', agendamentos: 23, atendimentos: 20 },
        { date: '07/04', agendamentos: 15, atendimentos: 13 },
        { date: '08/04', agendamentos: 45, atendimentos: 39 },
        { date: '09/04', agendamentos: 38, atendimentos: 33 },
        { date: '10/04', agendamentos: 33, atendimentos: 28 }
      ]
    }

    // Atualiza os gráficos com os novos dados
    updateCharts()

    isLoading.value = false
  }, 800)
}

// Função para criar/atualizar os gráficos
const createCharts = () => {
  // Configurações comuns dos gráficos
  const fontColor = '#6B7280'
  const gridColor = '#E5E7EB'

  // Gráfico de linha (Agendamentos x Atendimentos)
  const lineChartCtx = document.getElementById('line-chart') as HTMLCanvasElement
  if (lineChartCtx) {
    charts.value.lineChart = new Chart(lineChartCtx, {
      type: 'line',
      data: {
        labels: dailyData.value.map((d) => d.date),
        datasets: [
          {
            label: 'Agendamentos',
            backgroundColor: 'rgba(136, 132, 216, 0.2)',
            borderColor: '#8884d8',
            data: dailyData.value.map((d) => d.agendamentos),
            tension: 0.4
          },
          {
            label: 'Atendimentos',
            backgroundColor: 'rgba(130, 202, 157, 0.2)',
            borderColor: '#82ca9d',
            data: dailyData.value.map((d) => d.atendimentos),
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: gridColor
            },
            ticks: {
              color: fontColor
            }
          },
          x: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: fontColor
            }
          }
        }
      }
    })
  }

  // Gráfico de pizza (SLA)
  const pieChartCtx = document.getElementById('pie-chart') as HTMLCanvasElement
  if (pieChartCtx) {
    charts.value.pieChart = new Chart(pieChartCtx, {
      type: 'pie',
      data: {
        labels: slaData.value.map((d) => d.name),
        datasets: [
          {
            backgroundColor: ['rgba(76, 175, 80, 0.8)', 'rgba(244, 67, 54, 0.8)'],
            data: slaData.value.map((d) => d.value),
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: fontColor
            }
          }
        }
      }
    })
  }

  // Gráfico de barras (Atendimentos por Especialidade)
  const barChartCtx = document.getElementById('bar-chart') as HTMLCanvasElement
  if (barChartCtx) {
    charts.value.barChart = new Chart(barChartCtx, {
      type: 'bar',
      data: {
        labels: especialidadesData.value.map((d) => d.name),
        datasets: [
          {
            label: 'Atendimentos',
            backgroundColor: especialidadesData.value.map((d) => d.color),
            data: especialidadesData.value.map((d) => d.atendimentos),
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: gridColor
            },
            ticks: {
              color: fontColor
            }
          },
          x: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: fontColor
            }
          }
        }
      }
    })
  }

  // Gráfico de barras horizontais (Tempo Médio por Especialidade)
  const barChartHorizontalCtx = document.getElementById('bar-chart-horizontal') as HTMLCanvasElement
  if (barChartHorizontalCtx) {
    charts.value.barChartHorizontal = new Chart(barChartHorizontalCtx, {
      type: 'bar',
      data: {
        labels: tempoMedioData.value.map((d) => d.name),
        datasets: [
          {
            label: 'Tempo Médio (min)',
            backgroundColor: '#82ca9d',
            data: tempoMedioData.value.map((d) => d.tempo),
            borderWidth: 1
          },
          {
            label: 'SLA (min)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            data: tempoMedioData.value.map((d) => d.sla),
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: gridColor
            },
            ticks: {
              color: fontColor
            }
          },
          y: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: fontColor
            }
          }
        }
      }
    })
  }
}

// Função para atualizar os gráficos existentes
const updateCharts = () => {
  if (charts.value.lineChart) {
    charts.value.lineChart.data.labels = dailyData.value.map((d) => d.date)
    charts.value.lineChart.data.datasets[0].data = dailyData.value.map((d) => d.agendamentos)
    charts.value.lineChart.data.datasets[1].data = dailyData.value.map((d) => d.atendimentos)
    charts.value.lineChart.update()
  }

  // Outros gráficos não precisam ser atualizados porque os dados deles não mudam com o timeframe
}

// Função para destruir os gráficos
const destroyCharts = () => {
  Object.values(charts.value).forEach((chart) => {
    if (chart) {
      chart.destroy()
    }
  })
}

// Inicializa os gráficos após a montagem do componente
onMounted(() => {
  // Simula carregamento inicial
  isLoading.value = true
  setTimeout(() => {
    createCharts()
    isLoading.value = false
  }, 800)
})

// Limpa os gráficos antes de desmontar o componente
onBeforeUnmount(() => {
  destroyCharts()
})

// Recria os gráficos quando a página muda de tamanho
const handleResize = () => {
  destroyCharts()
  setTimeout(() => {
    createCharts()
  }, 200)
}

// Adiciona um listener para o redimensionamento da janela
window.addEventListener('resize', handleResize)

// Remove o listener quando o componente é desmontado
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <DefaultTemplate>
    <template #title>Dashboard Clínico</template>

    <!-- Filtros de período -->
    <div class="filters mb-4">
      <v-card variant="flat">
        <v-card-text>
          <v-btn-toggle v-model="timeframe" color="primary" mandatory>
            <v-btn value="week" @click="changeTimeframe('week')"> Esta Semana </v-btn>
            <v-btn value="month" @click="changeTimeframe('month')"> Este Mês </v-btn>
            <v-btn value="quarter" @click="changeTimeframe('quarter')"> Trimestre </v-btn>
          </v-btn-toggle>
        </v-card-text>
      </v-card>
    </div>

    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>

    <!-- Cards KPI -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="400">
          <v-card-item>
            <template #prepend>
              <v-icon color="primary" size="large" :icon="mdiCalendarCheck"></v-icon>
            </template>
            <v-card-title>Total de Agendamentos</v-card-title>
            <v-card-subtitle class="text-h3 text-primary">{{ totalAgendamentos }}</v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="400">
          <v-card-item>
            <template #prepend>
              <v-icon color="success" size="large" :icon="mdiAccountMultiple"></v-icon>
            </template>
            <v-card-title>Total de Atendimentos</v-card-title>
            <v-card-subtitle class="text-h3 text-success">{{ totalAtendimentos }}</v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="400">
          <v-card-item>
            <template #prepend>
              <v-icon color="warning" size="large" :icon="mdiChartLine"></v-icon>
            </template>
            <v-card-title>Taxa de Atendimento</v-card-title>
            <v-card-subtitle class="text-h3 text-warning">{{ taxaAtendimento }}%</v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="400">
          <v-card-item>
            <template #prepend>
              <v-icon color="info" size="large" :icon="mdiTimerSand"></v-icon>
            </template>
            <v-card-title>Tempo Médio</v-card-title>
            <v-card-subtitle class="text-h3 text-info"
              >{{ tempoMedioGeral.toFixed(1) }} min</v-card-subtitle
            >
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos -->
    <v-row class="mt-4">
      <!-- Agendamentos x Atendimentos -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Agendamentos x Atendimentos</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <canvas id="line-chart"></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- SLA de Atendimento -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>SLA de Atendimento</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <canvas id="pie-chart"></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <!-- Atendimentos por Especialidade -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Atendimentos por Especialidade</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <canvas id="bar-chart"></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Tempo Médio por Especialidade -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Tempo Médio vs SLA (min)</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <canvas id="bar-chart-horizontal"></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabela SLA -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Detalhe de SLA por Especialidade</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Especialidade</th>
                  <th>Tempo Médio (min)</th>
                  <th>SLA (min)</th>
                  <th>Status</th>
                  <th>Eficiência</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tempoMedioData" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.tempo }}</td>
                  <td>{{ item.sla }}</td>
                  <td>
                    <v-chip :color="item.tempo <= item.sla ? 'success' : 'error'" size="small">
                      {{ item.tempo <= item.sla ? 'Dentro do SLA' : 'Fora do SLA' }}
                    </v-chip>
                  </td>
                  <td>
                    <v-progress-linear
                      :model-value="Math.min(100, (item.sla / item.tempo) * 100)"
                      :color="item.tempo <= item.sla ? 'success' : 'error'"
                      height="10"
                      striped
                    >
                      {{ Math.round((item.sla / item.tempo) * 100) }}%
                    </v-progress-linear>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </DefaultTemplate>
</template>

<style scoped>
.chart-container {
  height: 300px;
  position: relative;
}
</style>
