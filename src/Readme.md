## A report on the Research Article titled "SEIR model for COVID-19 dynamics incorporating the environment and social distancing"

We would like to present this file to have an overview about our research article.

### Introduction
In Introduction, we used background information about COVID-19 and how the epidemic imposed in many countries. We also introduced about importance of reproduction number in Mathematical models.

The document structure is given as below in the submitted document:

```
| Abstract
| Introduction
|__ Mathematical model
|  | SIR model
|  | SEIR model
|  | SEIR-P model
|  |___disease-free equilibrium
|  |___reproduction number
|  |  |___greater than 1
|  |     |___less than 1
|  |  
|  | __Results
|       | given model
|       | extended model
| Limitations
| Conclusion

```


### The main Implemented Mathematical model in three different variations
In this section, we explained in detail about

The below function varies when alpha1 = 0, alpha2 = 0.5, and alpha1=0.5, alpha2=1, and alpha1=0,alpha2=1
```julia
function model_Simulation1(dxyz,initial_Parameters,p,tspan)
    alpha1,alpha2,beta1,beta2,eta_S,eta_A,b,mu = p
    S,E,IA,IS,R,P = initial_Parameters
    A = (beta1*S*P/(1+alpha1*P))
    B = beta2*S*(IA+ IS)/(1+alpha2*(IA+IS))
     dxyz[1] = (b - A - B + psi * E- mu*S)
     dxyz[2] = A + B - psi * E - mu*E - w*E
     dxyz[3] = (1-delta)*w*E - (mu + sigma)*IA - gamma_S * IA
     dxyz[4] = delta * w *E - (mu + sigma)*IS - mu * R
     dxyz[5] = gamma_S*IS + gamma_A*IA - mu*R
     dxyz[6] = eta_S * IA + eta_A*IS - mu_p*P
    dxyz
end
problem1 = ODEProblem(model_Simulation1,intial_Parameters,tspan,p)
solution1 = solve(problem1)
plot(solution1)
```



#### Finding the reproduction number

```julia
C1 = psi + mu + w
C2 = mu + sigma + gamma_S
C3 = mu + sigma + gamma_A
U = (beta2 * b * delta * w)/mu*C1*C2
V = (beta2*b*(1-delta)w)/mu*C1*C3
X = (4*beta1*b)/mu*mu_p
Y = (eta_S*delta*w)/C1*C2
Z = (eta_A*(1-delta)*w)/C1*C3
basic_reproduction= (U+V+sqrt((U+V)^2 + X*(Y*Z)))/2
println(basic_reproduction)
```

#### for Humans
```julia
C1 = psi + mu + w
C2 = mu + sigma + gamma_S
C3 = mu + sigma + gamma_A
A = (beta2*b)/mu*C1
B = (beta1*b)/mu*mu_p*C1
humans_Reproduction = A*(((delta *w)/C2) + ((1-delta)w)/C3)
println(humans_Reproduction)  
```
#### for pathogens
```julia
pathogens_Reproduction = B*(((eta_S*delta*w)/C2) + ((eta_A*(1-delta)*w)/C3))
println(pathogens_Reproduction)

```
#### Results (Reproduction number)

| Given model  | Implemented model |
| ------------- | ------------- |
|   2.0  | 0.56  |
