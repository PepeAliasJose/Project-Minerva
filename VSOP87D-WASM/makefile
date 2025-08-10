EMCC = emcc

SRC = main.c
OUT = build/main.js

CFLAGS = -O3 -s WASM=1 -s MODULARIZE=1 -s EXPORT_ES6=1 \
	-s EXPORTED_FUNCTIONS='["_earthCoordinatesGivenDateL", "_earthCoordinatesGivenDateB", "_earthCoordinatesGivenDateR", \
"_mercuryCoordinatesGivenDateL", "_mercuryCoordinatesGivenDateB", "_mercuryCoordinatesGivenDateR", \
"_venusCoordinatesGivenDateL", "_venusCoordinatesGivenDateB", "_venusCoordinatesGivenDateR", \
"_marsCoordinatesGivenDateL", "_marsCoordinatesGivenDateB", "_marsCoordinatesGivenDateR", \
"_jupiterCoordinatesGivenDateL", "_jupiterCoordinatesGivenDateB", "_jupiterCoordinatesGivenDateR", \
"_saturnCoordinatesGivenDateL", "_saturnCoordinatesGivenDateB", "_saturnCoordinatesGivenDateR", \
"_uranusCoordinatesGivenDateL", "_uranusCoordinatesGivenDateB", "_uranusCoordinatesGivenDateR", \
"_neptuneCoordinatesGivenDateL", "_neptuneCoordinatesGivenDateB", "_neptuneCoordinatesGivenDateR"]' #-s NO_FILESYSTEM=1 #-s EXPORTED_FUNCTIONS='["main"]'

all: $(OUT)

$(OUT): $(SRC)
	$(EMCC) $(SRC) $(CFLAGS) -o $(OUT)

clean:
	rm -f $(OUT) $(basename $(OUT)).wasm