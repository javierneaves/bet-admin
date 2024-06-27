// ya vez la deduccion que se hace a los managers y a voltio mientras el precio se reduce
// me gustaria tener un botton o switch para apagar eso
// que se quede commission fija a voltio y a el manager
// al momento de cambiar el precio en e.ppw
// por ejemplo estabamos con el plan de reducir en la cantidades programadas asi como esta el google sheets pero hoy hicimos el cambio de nuevo donde no se le reduce a el manager ni a voltio

let A = 7500
let B // SYSTEM PRICE, NO SE UTILIZA EN OTRAS FORMULAS
let C
let D
let E
let F = .9
let G 
let H
let I
let J
let K
let L
let M
let N
let O
let P
let Q
let R
let S
let T
let U
let V
let W
let X
let Y
let Z
let AA
let AB
let AC
let AD
let AE
let AF
let AG
let AH
let AI
let AJ = 'YES'
let AK = 'YES'
let AL
let AM
let AN
let AO
let AP
let AQ
let AR
let AS
let AT
let AU
let AV
let AW
let AX
let AY = 0.395
let AZ = 610
let BA = 3
let BB
let BC
let BD
let BE
let BF
let BG = 1500
let BH = 1500
let BI = 3000
let BJ = 1000
let BK
let BL
let BM = 3000
let BN
let BO
let BP
let BQ
let BR
let BS
let BT
let BU
let BV
let BW
let BX
let BY
let BZ
let CA
let CB
let CC
let CD
let CE
let CF
let CG
let CH
let CI = 2.3
let CJ
let CK
let CL
let CM
let CN = 1.10
let CO
let CP
let CQ
let CR
let CS
let CT = .3
let CU
let CV
let CW
let CX
let CY
let CZ
let DA
let DB
let DC
let DD
let DE
let DF
let DG = 1.3
let DH
let DI
let DJ
let DK
let DL
let DM
let DN
let DO
let DP
let DQ
let DR = 0
let DS = 0
let DT
let DU = .3
let DV
let DW
let DX
let DY
let DZ
let sumOfAdders = 0

function myFunction() {
  BC = Math.floor((A/AZ) + BA)
  C = parseFloat(BC*AY).toFixed(2)
  DM = DG+CT+CN
  CV = CU/C/1000 < 0.1
  CW = CV === 0.1 ? CV*C*1000 : 0
  CX = CW === 0 ? 0 : CU-CW
  DP = ((DM*F) * 0.528 * C* 1000) + CX
  DH = (DG*C*1000)+DP
  DO = ((DM*F) * 0.12 * C* 1000)
  CU = (CT*DH)+DO
  console.log(CU)
  
  DN = ((DM*F) * 0.352 * C* 1000) + CX
  CO = (CN*C*1000)+DN
  D = CO+BG+DS
  
  E = CO+DH+CE+DS
  
  
  BD = AZ*BC
  BB = BD/A
  BE = BD/C
  CD = CE/C/1000
  CE = BG+BH+BI+BJ+BM+ sumOfAdders
  CF = CE/(1-DV)
  CG = CF/C/1000
  CJ = C*CI*1000
  CK = (CI*C*1000)/(1-DV)
  CL = CK/C/1000
  
  CP = CO/C/1000
  CQ = CO/(1-DV)
  CR = D/C/1000
  
  
  
  
  CY = CU/(1-DV)
  CZ = CY/(C*1000)
  DB = DC/C/1000
  DC = DH/2
  DD = DC/(1-DV)
  DE = DD/(C*1000)
  
  DI = DH/C/1000
  DJ = DH/(1-DV)
  DK = DJ/(C*1000)
  
  
  
  
  DV = DU+DR
  DW = CD+DG+CN+CI
  DX = CG+DK+CR+CL

  B = CK+CQ+DJ+CF 
}
