#Pkg.add("Plots") # To install required package for plotting
#Pkg.add("DifferentialEquations") # To install required package for using differentialequations

using Plots # To load the package "Plots"
using DifferentialEquations # TO load the package "DifferentialEquations"

# Assinged model data
N = S + E + IA + IS + R # Total number of population
S = 93000 # Susceptible population
IA = 50  # Asymptomatically infected population
IS = 50 # Symptamatically infected population
R = 0 #  Recovered population
P = 500 # Pathogens population
E = 1000  # Exposed population

# parameters
b = 0.00018  #Birth rate of the human population
mu = 0.00004563  # Natural human death rate
mu1 = 60   #Human life expectancy (1\mu)
mu_p = 0.01724    #Natural death rate of pathogens in the environment
mu_p1 = 5.8 #Life expectancy of pathogens in the environment (1\mu_p)
alpha1 = 0.1    #Proportion of interaction with an infectious environment
alpha2 = 0.1    #Proportion of interaction with an infectious individual
beta1 = 0.00414  #Rate of transmission from S to E due to contact with P
beta2 = 0.0115   #Rate of transmission from S to E due to contact with IA and/or IS
delta = 0.7     #Proportion of symptomatic infectious people
psi = 0.0051     #Progression rate from E back to S due to robust immune system
w = 0.09         #Progression rate from E to either IA or IS
sigma = 0.0018   #Death rate due to the coronavirus
gamma_S = 0.05   #Rate of recovery of the symptomatic population
gamma_A = 0.0714 #Rate of recovery of the asymptomatic human population
eta_S = 0.1       #Rate of virus spread to environment by symptomatic infectious individuals
eta_A = 0.05      #Rate of virus spread to environment by asymptomatic infectious individuals

tspan = (0., 90) # time span from 0 to 90 days
intial_Parameters = [S,E,IA,IS,R,P] # to initialize the data
p = [alpha1,alpha2,beta1,beta2,eta_S,eta_A,b,mu,mu_p] # parameters are given in a vector

# Here we perform 3 variations by changing the parameters alpha1 and alpha2 based on
# reproduction number, intially we take alpha1 = 0.1 and alpha2 = 0.1

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
plot(solution1,title="model variation 1",xaxis="Time(Days)",yaxis="No.of Individuals",label=["symptomatic" "exposed" "asymptomaticallyInfected" "symptomaticallyInfected" "Recovered" "Pathogens"])
savefig("/home/shivakrishnakarnati/Documents/Simulation and visualization/Project/plot.png")



# Here we change the parameters and alpha1 and alpha2
function model_Simulation2(dxyz,initial_Parameters,p,tspan)
    alpha1 = 0.05    # Changed Constant alpha1
    alpha2 = 0    # Changed Constant alpha2
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
problem2 = ODEProblem(model_Simulation2,intial_Parameters,tspan,p)
solution2 = solve(problem2)
plot(solution2,title="Model variation 2",xaxis="Time(Days)",yaxis="No.of Individuals",label=["symptomatic" "exposed" "asymptomaticallyInfected" "symptomaticallyInfected" "Recovered" "Pathogens"])
savefig("/home/shivakrishnakarnati/Documents/Simulation and visualization/Project/plot.png")



#Again changing the parameters alpha1 and alpha2
function model_Simulation3(dxyz,initial_Parameters,p,tspan)
     alpha1 = 0.1   # Changed Constant alpha1
     alpha2 = 0.05   # Changed Constant alpha2
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
problem3 = ODEProblem(symptamatic3,intial_Parameters,tspan,p)
solution3 = solve(problem3)
plot(solution3,title="Model variation 3",xaxis="Time(Days)",yaxis="No.of Individuals",label=["symptomatic" "exposed" "asymptomaticallyInfected" "symptomaticallyInfected" "Recovered" "Pathogens"])
savefig("/home/shivakrishnakarnati/Documents/Simulation and visualization/Project/plot.png")
# Here we can observe that there is no much difference in symptamatic rate,
# while changing the constants alpha1 and alpha2


# Calculation of Basic Reproduction number
C1 = psi + mu + w
C2 = mu + sigma + gamma_S
C3 = mu + sigma + gamma_A
U = (beta2 * b * delta * w)/mu*C1*C2
V = (beta2*b*(1-delta)w)/mu*C1*C3
X = (4*beta1*b)/mu*mu_p
Y = (eta_S*delta*w)/C1*C2
Z = (eta_A*(1-delta)*w)/C1*C3
basic_reproduction= (U+V+sqrt((U+V)^2 + X*(Y*Z)))/2
println(basic_reproduction) #4.4970833312485704e-5


# Reproduction for humans
C1 = psi + mu + w
C2 = mu + sigma + gamma_S
C3 = mu + sigma + gamma_A
A = (beta2*b)/mu*C1
B = (beta1*b)/mu*mu_p*C1
humans_Reproduction = A*(((delta *w)/C2) + ((1-delta)w)/C3)
println(humans_Reproduction)  #0.006835974264236465

# Reproduction number for pathogens
pathogens_Reproduction = B*(((eta_S*delta*w)/C2) + ((eta_A*(1-delta)*w)/C3))
println(pathogens_Reproduction) #3.7489365411688278e-6


#################################################################################################

#  Model variation based on Indian state- Telengana Data
N = 35003674 # Total population as of March 2021
S = 2354664 # Total susceptible population during March 2021 to May 2021
IA = 23700 # asymptomatically infected
IS = 33000 # symptomatically infected
R = 0 # recovered as of May 2021
P = 41200 # assumed number of pathogens
E = 5000

# New model parameters
b = 0.0569  #Birth rate of the human population in Telangana as of 2021
mu = 0.18 # Natural human death rate
mu1 = 60   #Human life expectancy (1\mu)
mu_p = 0.02    #Natural death rate of pathogens in the environment
mu_p1 = 5.4 #Life expectancy of pathogens in the environment (1\mu_p)
alpha1 = 10.5    #Proportion of interaction with an infectious environment
alpha2 = 10.5    #Proportion of interaction with an infectious individual
beta1 = 8.414  #Rate of transmission from S to E due to contact with P
beta2 = 8.515   #Rate of transmission from S to E due to contact with IA and/or IS
delta = 1.7     #Proportion of symptomatic infectious people
psi = 0.51     #Progression rate from E back to S due to robust immune system
w = 0.1         #Progression rate from E to either IA or IS
sigma = 0.018   #Death rate due to the coronavirus
gamma_S = 3.05   #Rate of recovery of the symptomatic population
gamma_A = 3.714 #Rate of recovery of the asymptomatic human population
eta_S = 1.08       #Rate of virus spread to environment by symptomatic infectious individuals
eta_A = 1.09      #Rate of virus spread to environment by asymptomatic infectious individuals


tspan = (0., 60)
intial_Parameters = [S,E,IA,IS,R,P]
p = [alpha1,alpha2,beta1,beta2,eta_S,eta_A,b,mu,mu_p]

function model_Telangana(dxyz,initial_Parameters,p,tspan)
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
problem_T = ODEProblem(model_Telangana,intial_Parameters,tspan,p)
solution_T = solve(problem_T)
plot(solution_T,title="Extended model",xaxis="Time(Days)",yaxis="No.of Individuals",label=["symptomatic" "exposed" "asymptomaticallyInfected" "symptomaticallyInfected" "Recovered" "Pathogens"])
savefig("/home/shivakrishnakarnati/Documents/Simulation and visualization/Project/plot.png")


# Calculation of Basic Reproduction number
C1 = psi + mu + w
C2 = mu + sigma + gamma_S
C3 = mu + sigma + gamma_A
U = (beta2 * b * delta * w)/mu*C1*C2
V = (beta2*b*(1-delta)w)/mu*C1*C3
X = (4*beta1*b)/mu*mu_p
Y = (eta_S*delta*w)/C1*C2
Z = (eta_A*(1-delta)*w)/C1*C3
basic_reproduction= (U+V+sqrt((U+V)^2 + X*(Y*Z)))/2
println(basic_reproduction) #0.5649750628274046


# Reproduction for humans
C1 = psi + mu + w
C2 = mu + sigma + gamma_S
C3 = mu + sigma + gamma_A
A = (beta2*b)/mu*C1
B = (beta1*b)/mu*mu_p*C1
humans_Reproduction = A*(((delta *w)/C2) + ((1-delta)w)/C3)
println(humans_Reproduction)  #0.07324758998441214

# Reproduction number for pathogens
pathogens_Reproduction = B*(((eta_S*delta*w)/C2) + ((eta_A*(1-delta)*w)/C3))
println(pathogens_Reproduction) #0.0015558617548055299
