#include <stdio.h>
/* === PLANET DATA === */
#include "vsop_mer.h"
#include "vsop_ven.h"
#include "vsop_ear.h"
#include "vsop_mar.h"
#include "vsop_jup.h"
#include "vsop_sat.h"
#include "vsop_ura.h"
#include "vsop_nep.h"

#include "vsop_struct.h"

#include <math.h>

int main(){
    printf("Hola\n");
    return 0;
};

double getMeanLongitude (int i, double T) {
   double longitudes[] = {
    4.4026088424 + 26087.9031415742 * T, // Mercury
    3.17614669689 + 10213.285546211 * T, //  Venus
    1.75347045953 + 6283.0758499914 * T, //  Earth
    6.20347611291 + 3340.6124266998 * T, //  Mars
    0.59954649739 + 529.6909650946 * T, //  Jupiter
    0.8740167565 + 213.299095438 * T, //  Saturn
    5.48129387159 + 74.7815985673 * T, //  Uranus
    5.31188628676 + 38.1330356378 * T, //  Neptune
    5.19846674103 + 77713.7714681205 * T, //  Moon D
    1.62790523337 + 84334.6615813083 * T, // Moon F
    2.35555589827 + 83286.9142695536 * T, // Moon l
    3.81034454697 + 83997.0911355954 * T // Moon Lm
  };

  return longitudes[i];
}

typedef struct {
    VSOPTerm *t;   // puntero a la lista de terminos 
    size_t len;    // número de terminos en esa lista
} VSOPCompleteTerm;


// Cálculo de indice phi = sum a(i) * mean_longitude(i)
double calculateIndex(const int terms[12], double T) {
    double phi = 0.0;
    for (int x = 0; x < 12; ++x) {
        phi += terms[x] * getMeanLongitude(x, T);
    }
    return phi;
}


// Suma de subterminos para una serie de una tabla L0, L1 ect
double calculateSubTerm(const VSOPTerm list[], size_t len, double T) {
    double X = 0.0;
    for (size_t x = 0; x < len; ++x) {
        double phi = calculateIndex(list[x].a, T);
        X += list[x].S * sin(phi) + list[x].K * cos(phi);
    }
    return X;
}


// Calcula termino completo
// tables: array de VSOPCompleteTerm cada elemento es un subterminp
double calculateTerm(const VSOPCompleteTerm tables[], double T) {
    double X = 0.0;
    for (size_t n = 0; n <= 5; ++n) {
        double sub = calculateSubTerm(tables[n].t, tables[n].len, T);
        X += sub * pow(T, (double)n);
    }
    return X;
}


// Usar sizeof(array)/sizeof(VSOPTerm) para la cantitdad de terminos

//Tierra
double earthCoordinatesGivenDateL(double T) {
    VSOPCompleteTerm t[6] = {
        { ear_LL0, sizeof(ear_LL0) / sizeof(VSOPTerm) },
        { ear_LL1, sizeof(ear_LL1) / sizeof(VSOPTerm) },
        { ear_LL2, sizeof(ear_LL2) / sizeof(VSOPTerm) },
        { ear_LL3, sizeof(ear_LL3) / sizeof(VSOPTerm) },
        { ear_LL4, sizeof(ear_LL4) / sizeof(VSOPTerm) },
        { ear_LL5, sizeof(ear_LL5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double earthCoordinatesGivenDateB(double T) {
    VSOPCompleteTerm t[6] = {
        { ear_BB0, sizeof(ear_BB0) / sizeof(VSOPTerm) },
        { ear_BB1, sizeof(ear_BB1) / sizeof(VSOPTerm) },
        { ear_BB2, sizeof(ear_BB2) / sizeof(VSOPTerm) },
        { ear_BB3, sizeof(ear_BB3) / sizeof(VSOPTerm) },
        { ear_BB4, sizeof(ear_BB4) / sizeof(VSOPTerm) },
        { ear_BB5, sizeof(ear_BB5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double earthCoordinatesGivenDateR(double T) {
    VSOPCompleteTerm t[6] = {
        { ear_RR0, sizeof(ear_RR0) / sizeof(VSOPTerm) },
        { ear_RR1, sizeof(ear_RR1) / sizeof(VSOPTerm) },
        { ear_RR2, sizeof(ear_RR2) / sizeof(VSOPTerm) },
        { ear_RR3, sizeof(ear_RR3) / sizeof(VSOPTerm) },
        { ear_RR4, sizeof(ear_RR4) / sizeof(VSOPTerm) },
        { ear_RR5, sizeof(ear_RR5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

//Mercurio
double mercuryCoordinatesGivenDateL(double T) {
    VSOPCompleteTerm t[6] = {
        { mer_LL0, sizeof(mer_LL0) / sizeof(VSOPTerm) },
        { mer_LL1, sizeof(mer_LL1) / sizeof(VSOPTerm) },
        { mer_LL2, sizeof(mer_LL2) / sizeof(VSOPTerm) },
        { mer_LL3, sizeof(mer_LL3) / sizeof(VSOPTerm) },
        { mer_LL4, sizeof(mer_LL4) / sizeof(VSOPTerm) },
        { mer_LL5, sizeof(mer_LL5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double mercuryCoordinatesGivenDateB(double T) {
    VSOPCompleteTerm t[6] = {
        { mer_BB0, sizeof(mer_BB0) / sizeof(VSOPTerm) },
        { mer_BB1, sizeof(mer_BB1) / sizeof(VSOPTerm) },
        { mer_BB2, sizeof(mer_BB2) / sizeof(VSOPTerm) },
        { mer_BB3, sizeof(mer_BB3) / sizeof(VSOPTerm) },
        { mer_BB4, sizeof(mer_BB4) / sizeof(VSOPTerm) },
        { mer_BB5, sizeof(mer_BB5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double mercuryCoordinatesGivenDateR(double T) {
    VSOPCompleteTerm t[6] = {
        { mer_RR0, sizeof(mer_RR0) / sizeof(VSOPTerm) },
        { mer_RR1, sizeof(mer_RR1) / sizeof(VSOPTerm) },
        { mer_RR2, sizeof(mer_RR2) / sizeof(VSOPTerm) },
        { mer_RR3, sizeof(mer_RR3) / sizeof(VSOPTerm) },
        { mer_RR4, sizeof(mer_RR4) / sizeof(VSOPTerm) },
        { mer_RR5, sizeof(mer_RR5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

// Venus
double venusCoordinatesGivenDateL(double T) {
    VSOPCompleteTerm t[6] = {
        { ven_LL0, sizeof(ven_LL0) / sizeof(VSOPTerm) },
        { ven_LL1, sizeof(ven_LL1) / sizeof(VSOPTerm) },
        { ven_LL2, sizeof(ven_LL2) / sizeof(VSOPTerm) },
        { ven_LL3, sizeof(ven_LL3) / sizeof(VSOPTerm) },
        { ven_LL4, sizeof(ven_LL4) / sizeof(VSOPTerm) },
        { ven_LL5, sizeof(ven_LL5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double venusCoordinatesGivenDateB(double T) {
    VSOPCompleteTerm t[6] = {
        { ven_BB0, sizeof(ven_BB0) / sizeof(VSOPTerm) },
        { ven_BB1, sizeof(ven_BB1) / sizeof(VSOPTerm) },
        { ven_BB2, sizeof(ven_BB2) / sizeof(VSOPTerm) },
        { ven_BB3, sizeof(ven_BB3) / sizeof(VSOPTerm) },
        { ven_BB4, sizeof(ven_BB4) / sizeof(VSOPTerm) },
        { ven_BB5, sizeof(ven_BB5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double venusCoordinatesGivenDateR(double T) {
    VSOPCompleteTerm t[6] = {
        { ven_RR0, sizeof(ven_RR0) / sizeof(VSOPTerm) },
        { ven_RR1, sizeof(ven_RR1) / sizeof(VSOPTerm) },
        { ven_RR2, sizeof(ven_RR2) / sizeof(VSOPTerm) },
        { ven_RR3, sizeof(ven_RR3) / sizeof(VSOPTerm) },
        { ven_RR4, sizeof(ven_RR4) / sizeof(VSOPTerm) },
        { ven_RR5, sizeof(ven_RR5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

// Marte
double marsCoordinatesGivenDateL(double T) {
    VSOPCompleteTerm t[6] = {
        { mar_LL0, sizeof(mar_LL0) / sizeof(VSOPTerm) },
        { mar_LL1, sizeof(mar_LL1) / sizeof(VSOPTerm) },
        { mar_LL2, sizeof(mar_LL2) / sizeof(VSOPTerm) },
        { mar_LL3, sizeof(mar_LL3) / sizeof(VSOPTerm) },
        { mar_LL4, sizeof(mar_LL4) / sizeof(VSOPTerm) },
        { mar_LL5, sizeof(mar_LL5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double marsCoordinatesGivenDateB(double T) {
    VSOPCompleteTerm t[6] = {
        { mar_BB0, sizeof(mar_BB0) / sizeof(VSOPTerm) },
        { mar_BB1, sizeof(mar_BB1) / sizeof(VSOPTerm) },
        { mar_BB2, sizeof(mar_BB2) / sizeof(VSOPTerm) },
        { mar_BB3, sizeof(mar_BB3) / sizeof(VSOPTerm) },
        { mar_BB4, sizeof(mar_BB4) / sizeof(VSOPTerm) },
        { mar_BB5, sizeof(mar_BB5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double marsCoordinatesGivenDateR(double T) {
    VSOPCompleteTerm t[6] = {
        { mar_RR0, sizeof(mar_RR0) / sizeof(VSOPTerm) },
        { mar_RR1, sizeof(mar_RR1) / sizeof(VSOPTerm) },
        { mar_RR2, sizeof(mar_RR2) / sizeof(VSOPTerm) },
        { mar_RR3, sizeof(mar_RR3) / sizeof(VSOPTerm) },
        { mar_RR4, sizeof(mar_RR4) / sizeof(VSOPTerm) },
        { mar_RR5, sizeof(mar_RR5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

// Júpiter
double jupiterCoordinatesGivenDateL(double T) {
    VSOPCompleteTerm t[6] = {
        { jup_LL0, sizeof(jup_LL0) / sizeof(VSOPTerm) },
        { jup_LL1, sizeof(jup_LL1) / sizeof(VSOPTerm) },
        { jup_LL2, sizeof(jup_LL2) / sizeof(VSOPTerm) },
        { jup_LL3, sizeof(jup_LL3) / sizeof(VSOPTerm) },
        { jup_LL4, sizeof(jup_LL4) / sizeof(VSOPTerm) },
        { jup_LL5, sizeof(jup_LL5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double jupiterCoordinatesGivenDateB(double T) {
    VSOPCompleteTerm t[6] = {
        { jup_BB0, sizeof(jup_BB0) / sizeof(VSOPTerm) },
        { jup_BB1, sizeof(jup_BB1) / sizeof(VSOPTerm) },
        { jup_BB2, sizeof(jup_BB2) / sizeof(VSOPTerm) },
        { jup_BB3, sizeof(jup_BB3) / sizeof(VSOPTerm) },
        { jup_BB4, sizeof(jup_BB4) / sizeof(VSOPTerm) },
        { jup_BB5, sizeof(jup_BB5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double jupiterCoordinatesGivenDateR(double T) {
    VSOPCompleteTerm t[6] = {
        { jup_RR0, sizeof(jup_RR0) / sizeof(VSOPTerm) },
        { jup_RR1, sizeof(jup_RR1) / sizeof(VSOPTerm) },
        { jup_RR2, sizeof(jup_RR2) / sizeof(VSOPTerm) },
        { jup_RR3, sizeof(jup_RR3) / sizeof(VSOPTerm) },
        { jup_RR4, sizeof(jup_RR4) / sizeof(VSOPTerm) },
        { jup_RR5, sizeof(jup_RR5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

// Saturno
double saturnCoordinatesGivenDateL(double T) {
    VSOPCompleteTerm t[6] = {
        { sat_LL0, sizeof(sat_LL0) / sizeof(VSOPTerm) },
        { sat_LL1, sizeof(sat_LL1) / sizeof(VSOPTerm) },
        { sat_LL2, sizeof(sat_LL2) / sizeof(VSOPTerm) },
        { sat_LL3, sizeof(sat_LL3) / sizeof(VSOPTerm) },
        { sat_LL4, sizeof(sat_LL4) / sizeof(VSOPTerm) },
        { sat_LL5, sizeof(sat_LL5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double saturnCoordinatesGivenDateB(double T) {
    VSOPCompleteTerm t[6] = {
        { sat_BB0, sizeof(sat_BB0) / sizeof(VSOPTerm) },
        { sat_BB1, sizeof(sat_BB1) / sizeof(VSOPTerm) },
        { sat_BB2, sizeof(sat_BB2) / sizeof(VSOPTerm) },
        { sat_BB3, sizeof(sat_BB3) / sizeof(VSOPTerm) },
        { sat_BB4, sizeof(sat_BB4) / sizeof(VSOPTerm) },
        { sat_BB5, sizeof(sat_BB5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double saturnCoordinatesGivenDateR(double T) {
    VSOPCompleteTerm t[6] = {
        { sat_RR0, sizeof(sat_RR0) / sizeof(VSOPTerm) },
        { sat_RR1, sizeof(sat_RR1) / sizeof(VSOPTerm) },
        { sat_RR2, sizeof(sat_RR2) / sizeof(VSOPTerm) },
        { sat_RR3, sizeof(sat_RR3) / sizeof(VSOPTerm) },
        { sat_RR4, sizeof(sat_RR4) / sizeof(VSOPTerm) },
        { sat_RR5, sizeof(sat_RR5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

// Urano
double uranusCoordinatesGivenDateL(double T) {
    VSOPCompleteTerm t[6] = {
        { ura_LL0, sizeof(ura_LL0) / sizeof(VSOPTerm) },
        { ura_LL1, sizeof(ura_LL1) / sizeof(VSOPTerm) },
        { ura_LL2, sizeof(ura_LL2) / sizeof(VSOPTerm) },
        { ura_LL3, sizeof(ura_LL3) / sizeof(VSOPTerm) },
        { ura_LL4, sizeof(ura_LL4) / sizeof(VSOPTerm) },
        { ura_LL5, sizeof(ura_LL5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double uranusCoordinatesGivenDateB(double T) {
    VSOPCompleteTerm t[6] = {
        { ura_BB0, sizeof(ura_BB0) / sizeof(VSOPTerm) },
        { ura_BB1, sizeof(ura_BB1) / sizeof(VSOPTerm) },
        { ura_BB2, sizeof(ura_BB2) / sizeof(VSOPTerm) },
        { ura_BB3, sizeof(ura_BB3) / sizeof(VSOPTerm) },
        { ura_BB4, sizeof(ura_BB4) / sizeof(VSOPTerm) },
        { ura_BB5, sizeof(ura_BB5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double uranusCoordinatesGivenDateR(double T) {
    VSOPCompleteTerm t[6] = {
        { ura_RR0, sizeof(ura_RR0) / sizeof(VSOPTerm) },
        { ura_RR1, sizeof(ura_RR1) / sizeof(VSOPTerm) },
        { ura_RR2, sizeof(ura_RR2) / sizeof(VSOPTerm) },
        { ura_RR3, sizeof(ura_RR3) / sizeof(VSOPTerm) },
        { ura_RR4, sizeof(ura_RR4) / sizeof(VSOPTerm) },
        { ura_RR5, sizeof(ura_RR5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

// Neptuno
double neptuneCoordinatesGivenDateL(double T) {
    VSOPCompleteTerm t[6] = {
        { nep_LL0, sizeof(nep_LL0) / sizeof(VSOPTerm) },
        { nep_LL1, sizeof(nep_LL1) / sizeof(VSOPTerm) },
        { nep_LL2, sizeof(nep_LL2) / sizeof(VSOPTerm) },
        { nep_LL3, sizeof(nep_LL3) / sizeof(VSOPTerm) },
        { nep_LL4, sizeof(nep_LL4) / sizeof(VSOPTerm) },
        { nep_LL5, sizeof(nep_LL5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double neptuneCoordinatesGivenDateB(double T) {
    VSOPCompleteTerm t[6] = {
        { nep_BB0, sizeof(nep_BB0) / sizeof(VSOPTerm) },
        { nep_BB1, sizeof(nep_BB1) / sizeof(VSOPTerm) },
        { nep_BB2, sizeof(nep_BB2) / sizeof(VSOPTerm) },
        { nep_BB3, sizeof(nep_BB3) / sizeof(VSOPTerm) },
        { nep_BB4, sizeof(nep_BB4) / sizeof(VSOPTerm) },
        { nep_BB5, sizeof(nep_BB5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}

double neptuneCoordinatesGivenDateR(double T) {
    VSOPCompleteTerm t[6] = {
        { nep_RR0, sizeof(nep_RR0) / sizeof(VSOPTerm) },
        { nep_RR1, sizeof(nep_RR1) / sizeof(VSOPTerm) },
        { nep_RR2, sizeof(nep_RR2) / sizeof(VSOPTerm) },
        { nep_RR3, sizeof(nep_RR3) / sizeof(VSOPTerm) },
        { nep_RR4, sizeof(nep_RR4) / sizeof(VSOPTerm) },
        { nep_RR5, sizeof(nep_RR5) / sizeof(VSOPTerm) }
    };
    return calculateTerm(t, T);
}
