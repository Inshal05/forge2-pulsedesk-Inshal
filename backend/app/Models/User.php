<?php                                                                                                                                               
                                                                                                                                                      
  namespace App\Models;                                                                                                                               
                                                                                                                                                      
  use Illuminate\Database\Eloquent\Factories\HasFactory;                                                                                              
  use Illuminate\Database\Eloquent\Relations\BelongsTo;                                                                                               
  use Illuminate\Database\Eloquent\Relations\HasMany;                                                                                                 
  use Illuminate\Foundation\Auth\User as Authenticatable;                                                                                             
  use Illuminate\Notifications\Notifiable;                                                                                                            
  use Laravel\Sanctum\HasApiTokens;                                                                                                                   
                                                                                                                                                      
  class User extends Authenticatable                                                                                                                  
  {                                                                                                                                                   
      use HasApiTokens, HasFactory, Notifiable;                                                                                                       
                                                                                                                                                      
      protected $fillable = [                                                                                                                         
          'organization_id',                                                                                                                          
          'name',                                                                                                                                     
          'email',                                                                                                                                    
          'email_verified_at',                                                                                                                        
          'password',                                                                                                                                 
          'role',                                                                                                                                     
          'avatar',                                                                                                                                   
          'phone',                                                                                                                                    
          'is_active',                                                                                                                                
      ];                                                                                                                                              
                                                                                                                                                      
      protected $hidden = [                                                                                                                           
          'password',                                                                                                                                 
          'remember_token',                                                                                                                           
      ];                                                                                                                                              
                                                                                                                                                      
      protected function casts(): array                                                                                                               
      {                                                                                                                                               
          return [                                                                                                                                    
              'email_verified_at' => 'datetime',                                                                                                      
              'password'          => 'hashed',                                                                                                        
              'is_active'         => 'boolean',                                                                                                       
          ];                                                                                                                                          
      }                                                                                                                                               
                                                                                                                                                      
      public function organization(): BelongsTo                                                                                                       
      {                                                                                                                                               
          return $this->belongsTo(Organization::class);                                                                                               
      }                                                                                                                                               
                                                                                                                                                      
      public function tickets(): HasMany                                                                                                              
      {                                                                                                                                               
          return $this->hasMany(Ticket::class, 'user_id');                                                                                            
      }                                                                                                                                               
                                                                                                                                                      
      public function assignedTickets(): HasMany                                                                                                      
      {                                                                                                                                               
          return $this->hasMany(Ticket::class, 'assigned_to');                                                                                        
      }                                                                                                                                               
                                                                                                                                                      
      public function ticketComments(): HasMany                                                                                                       
      {                                                                                                                                               
          return $this->hasMany(TicketComment::class);                                                                                                
      }                                                                                                                                               
                                                                                                                                                      
      public function activityLogs(): HasMany                                                                                                         
      {                                                                                                                                               
          return $this->hasMany(ActivityLog::class);                                                                                                  
      }                                                                                                                                               
}                                                                                                                                                   