(function() {
/* global Dygraph:false */
'use strict'

const synchronize = graphs => {
  graphs.forEach(g => {
    g.ready(() => {
      attachZoomHandlers(graphs, g)
      attachSelectionHandlers(graphs)
    })
  })

  return {
    detach: () => {
      graphs.forEach(g =>
        g.updateOptions({
          drawCallback: null,
          highlightCallback: null,
          unhighlightCallback: null
        })
      )
    }
  }
}

const attachZoomHandlers = (graphs, graph) => {
  graph.updateOptions({
    drawCallback: (me, initial) => {
      graphs.forEach(g => {
        if (g !== graph) {
          console.log(g.getOption('dateWindow'))
          console.log(g.getOption('valueRange'))
          if (g.getOption('dateWindow') === graph.getOption('dateWindow'))
            return

          g.updateOptions({dateWindow: graph.xAxisRange()})
        }
      })
    }
  }, true)
}

const attachSelectionHandlers = gs => {
  var block = false

  gs.forEach(g => {
    g.updateOptions({
      highlightCallback: (event, x, points, row, seriesName) => {
        if (block) return
        block = true
        gs.forEach(gr => {
          let idx = gr.getRowForX(x)
          let range = 0

          if (!idx) {
            var lowBound = x - 50000
            var highBound = x + 50000
            while (range < 50000) {
                idx = gr.getRowForX(x - range) || gr.getRowForX(x + range)
                if (idx !== null) {
                    break
                }
                range += 10
            }
          }

          if (idx !== null) {
            gr.setSelection(idx, seriesName)
          }
        })
        block = false
      },

      unhighlightCallback: (event) => {
        if (block) return
        block = true;
        gs.forEach((g, i) => {
          if (this == g) {
            if (prevCallbacks[i] && prevCallbacks[i].unhighlightCallback) {
              prevCallbacks[i].unhighlightCallback.apply(this, arguments);
            }
            return
          }
        })
        block = false
      }

    })
  })
  for (var i = 0; i < gs.length; i++) {
    var g = gs[i];

    g.updateOptions({

      highlightCallback: (event, x, points, row, seriesName) => {
        if (block) return
        block = true

        gs.forEach((g, i) => {
          if (g == this) {
            if (prevCallbacks[i] && prevCallbacks[i].highlightCallback) {
              prevCallbacks[i].highlightCallback.apply(this, arguments)
            }
            return
          }

          let idx = g.getRowForX(x)
          let range = 0

          if (!idx) {
            var lowBound = x - 50000;
            var highBound = x + 50000;
            while (range < 50000) {
                idx = gs[i].getRowForX(x - range) || gs[i].getRowForX(x + range);
                if (idx !== null) {
                    break;
                }
                range ++;
            }
          }

          if (idx !== null) {
            g.setSelection(idx, seriesName)
          }
        })
        block = false
      },

      unhighlightCallback: (event) => {
        if (block) return
        block = true;
        gs.forEach((g, i) => {
          if (this == g) {
            if (prevCallbacks[i] && prevCallbacks[i].unhighlightCallback) {
              prevCallbacks[i].unhighlightCallback.apply(this, arguments);
            }
            return
          }
        })
        block = false
      }
    }, true)
  }
}

window.Dygraph.synchronize = synchronize
})()