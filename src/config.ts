import { WorldParam } from "./model/type";

export const theme = {
    plotBackground: {
        fill: "rgb(25, 23, 44)"
    }, // 绘图区域
    animation: true,
    axis: {
        top: {
            label: {
                textStyle: {
                    fill: "#A6A6A6"
                }
            },
            line: {
                stroke: "#737373"
            },
            tickLine: {
                stroke: "#737373"
            }
        },
        bottom: {
            label: {
                textStyle: {
                    fill: "#A6A6A6"
                }
            },
            line: {
                stroke: "#737373"
            },
            tickLine: {
                stroke: "#737373"
            }
        },
        left: {
            label: {
                textStyle: {
                    fill: "#A6A6A6"
                }
            },
            grid: {
                lineStyle: {
                    stroke: "#404040"
                }
            }
        },
        right: {
            label: {
                textStyle: {
                    fill: "#A6A6A6"
                }
            },
            grid: {
                lineStyle: {
                    stroke: "#404040"
                }
            }
        },
        circle: {
            label: {
                textStyle: {
                    fill: "#A6A6A6"
                }
            },
            line: {
                stroke: "#737373"
            },
            tickLine: {
                stroke: "#737373"
            },
            grid: {
                lineStyle: {
                    stroke: "#404040"
                }
            }
        },
        radius: {
            label: {
                textStyle: {
                    fill: "#A6A6A6"
                }
            },
            line: {
                stroke: "#737373"
            },
            tickLine: {
                stroke: "#737373"
            },
            grid: {
                lineStyle: {
                    stroke: "#404040"
                }
            }
        },
        helix: {
            line: {
                stroke: "#737373"
            },
            tickLine: {
                stroke: "#737373"
            }
        }
    },
    label: {
        textStyle: {
            fill: "#A6A6A6"
        }
    },
    legend: {
        right: {
            textStyle: {
                fill: "#737373"
            },
            unCheckColor: "#bfbfbf"
        },
        left: {
            textStyle: {
                fill: "#737373"
            }, // 图例项文本的样式
            unCheckColor: "#bfbfbf"
        },
        top: {
            textStyle: {
                fill: "#737373"
            }, // 图例项文本的样式
            unCheckColor: "#bfbfbf"
        },
        bottom: {
            textStyle: {
                fill: "#737373"
            }, // 图例项文本的样式
            unCheckColor: "#bfbfbf"
        },
        html: {
            'g2-legend': {
                color: "#D9D9D9"
            }
        },
        gradient: {
            textStyle: {
                fill: "#D9D9D9"
            },
            lineStyle: {
                stroke: "#404040"
            }
        }
    },
    tooltip: {
        // css style for tooltip
        [`g2-tooltip`]: {
            color: "#D9D9D9",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            boxShadow: "0px 0px 2px #000"
        }
    },
    tooltipCrosshairsRect: {
        type: "rect",
        rectStyle: {
            fill: "#fff",
            opacity: 0.1
        }
    }, // tooltip 辅助背景框样式
    tooltipCrosshairsLine: {
        lineStyle: {
            stroke: "rgba(255, 255, 255, 0.45)"
        }
    },
    guide: {
        line: {
            text: {
                style: {
                    fill: "#A6A6A6"
                }
            }
        },
        text: {
            style: {
                fill: "#A6A6A6"
            }
        },
        region: {
            // TODO
            style: {
                lineWidth: 0, // 辅助框的边框宽度
                fill: "#000", // 辅助框填充的颜色
                fillOpacity: 0.04 // 辅助框的背景透明度
            } // 辅助框的图形样式属性
        }
    }
};

export const defaultWorldParam: WorldParam = {
    disease: {
        cureRate: 1 / 3 / 30 / 50,
        deadRate: 1 / 3 / 30 / 100,
        immuneRate: 0,
        infectiousRate: 1 / 5000,
        name: 'virus',
        selfRecoverRate: 0.0,
        seriousRate: 1 / 3 / 50,
        toExposedInfactiousRate: 1 / 3 / 100,
        toLatentlyInfactiousRate: 1 / 3 / 4,
    },
    family: {
        familyPopulationDistribution: [
            [1000, 2],
            [500, 4],
            [250, 8],
            [125, 16]
        ],
        partyRate: 0.05,
    },
    medicine: {
        confirmRate: 0.05,
        cureRateInHospital: 0.0002,
        cureRateOnMedicalBed: 0.0004,
        deteriorateFactorOnMedicalBed: 0.5,
        visitingHospitalRate: 0.005,
        doctorNum: 1000,
        infactiousRateBetweenDoctorAndPatient: 1 / 50000,
        infactiousRateBetweenPatients: 1 / 10000,
        medicalBedNumber: 2000
    },
    individual: {
        goOutRateWhenQuarantedAtHome: 0.01,
        visitingHospitalRateWhenExposed: 0.02,
    },
    numberOfScenePerDay: 3,
    init: {
        origin: 'cemetery',
        initialSize: 40
    },
    region: {
        densityOfPopulation: 10,
        doPeriodicPhysicalExamination: true,
        facilityActiveRate: 10,
        privateCarRate: 0.2,
        unemploymentRate: 0.07
    }
};